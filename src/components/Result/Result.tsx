import { Box, CircularProgress, Paper, Typography } from '@material-ui/core'
import { JOBS } from 'data/jobs'
import { getStats } from 'parse/etro/api'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Stats } from 'simulator/entity/player/stats'
import { Simulator } from 'simulator/simulator'
import { formatSeconds } from 'utilities/format'
import { v4 as uuid } from 'uuid'
import { GearsetTable } from './Gearsets/GearsetTable'
import { DamageGraph, GraphData } from './Graph/DamageGraph'
import styles from './Result.module.css'

interface RouterProps {
    rid: string
    fid: string
    pid: string
}

type Props = RouteComponentProps<RouterProps>

export interface GearsetInfo {
    id: string
    name: string
    expected: number
    stats: Stats
    data: GraphData
}

interface State {
    ready: boolean
    gearsets: GearsetInfo[]
    encounter: string
    player: string
    time: string
}

export class Result extends React.Component<Props, State> {
    private reportID = this.props.match.params.rid
    private fightID = parseInt(this.props.match.params.fid)
    private playerID = parseInt(this.props.match.params.pid)

    private simulator: Simulator

    constructor(props: Props) {
        super(props)
        this.state = {
            ready: false,
            gearsets: [],
            encounter: '',
            player: '',
            time: '',
        }
    }

    async componentDidMount() {
        await this.setup(this.reportID, this.fightID)
    }

    private async setup(reportID: string, fightID: number) {
        const parser = new FFLogsParser(reportID, fightID)
        await parser.init()

        const player = parser.fight.friends
            .filter((friend: Friend) => friend.id === this.playerID)[0]

        this.simulator = new Simulator(parser, player)

        // Autopopulate the BiS set for this job
        await this.loadGearset(JOBS[player.type].bis)

        this.setState({
            ready: true,
            encounter: parser.fight.encounter,
            player: player.name,
            time: formatSeconds((parser.fight.end - parser.fight.start) / 1000),
        })
    }

    private updateGearsets(newGearsets: GearsetInfo[]) {
        newGearsets.sort((a, b) => b.expected - a.expected)
        this.setState({
            gearsets: newGearsets,
        })
    }

    private loadGearset = async (gearsetID: string) => {
        const existingGearset = this.state.gearsets
            .filter(gear => gear.id === gearsetID)[0]

        if (existingGearset) {
            // TODO error out (actually just delete this because it's a downstream problem)
            return
        }

        const { name, stats } = await getStats(gearsetID)
        const result = await this.simulator.calculateDamage(stats)

        const gearsetInfo: GearsetInfo = {
            id: gearsetID,
            name: name,
            stats: stats,
            expected: result.expected,
            data: {
                id: name,
                data: result.data,
            },
        }

        this.updateGearsets([...this.state.gearsets, gearsetInfo])
    }

    private removeGearset = async (gearset: GearsetInfo) => {
        const gearsets = this.state.gearsets.filter(set => set !== gearset)
        this.updateGearsets(gearsets)
    }

    private updateGearset = async (gearset: GearsetInfo, stats: Stats, name: string) => {
        // Recalculate DPS
        const result = await this.simulator.calculateDamage(stats)

        const updatedSet: GearsetInfo = {
            id: gearset.id,
            name: name,
            stats: { ...stats },
            expected: result.expected,
            data: {
                id: name,
                data: result.data,
            },
        }

        this.removeGearset(gearset)
        this.updateGearsets([updatedSet, ...this.state.gearsets])
    }

    private cloneGearset = async (gearset: GearsetInfo) => {
        // Generate a unique copy name for the new gearset
        let copyCount = 1
        let foundNewName = false
        let newName: string

        while (!foundNewName) {
            newName = `${gearset.name} (${copyCount})`
            if (!this.state.gearsets.some(gear => gear.name === newName)) {
                foundNewName = true
            }
            copyCount++
        }

        const clonedSet = {
            id: uuid(),
            name: newName,
            stats: { ...gearset.stats },
            expected: gearset.expected,
            data: {
                id: newName,
                data: [...gearset.data.data],
            },
        }

        this.updateGearsets([clonedSet, ...this.state.gearsets])
    }

    render() {
        if (!this.state.ready) {
            return <CircularProgress size={80} className={styles.loading} />
        }

        return <div className={styles.result}>
            <Box mb={2}>
                <Typography align="center" variant="h4" style={{ color: 'white' }}>
                    {this.state.player} - {this.state.encounter} ({this.state.time})
                </Typography>
            </Box>
            <Paper>
                <Box p={2}>
                    <DamageGraph gearsets={this.state.gearsets} />
                </Box>
            </Paper>
            <Box mt={2} overflow="hidden">
                <GearsetTable
                    gearsets={this.state.gearsets}
                    loadGearset={this.loadGearset}
                    removeGearset={this.removeGearset}
                    updateGearset={this.updateGearset}
                    cloneGearset={this.cloneGearset}
                />
            </Box>
        </div>
    }
}
