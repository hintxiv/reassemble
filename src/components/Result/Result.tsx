import { Box, CircularProgress, Grid, IconButton, Paper } from '@material-ui/core'
import { Clear, Sync } from '@material-ui/icons'
import { getStats } from 'parse/etro/api'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Stats } from 'simulator/entity/player/stats'
import { Simulator } from 'simulator/simulator'
import { DamageGraph, GraphData } from './DamageGraph'
import { BasePanel } from './Gearsets/BasePanel'
import { ComparisonPanel } from './Gearsets/ComparisonPanel'
import { SetSelect } from './Gearsets/SetSelect'
import styles from './Result.module.css'

interface RouterProps {
    rid: string
    fid: string
    pid: string
    gid: string
    gid2?: string
}

type Props = RouteComponentProps<RouterProps>

export interface GearsetInfo {
    name: string
    expected: number
    stats: Stats
    data: GraphData
}

interface State {
    ready: boolean
    baseGearset?: GearsetInfo
    compareGearset?: GearsetInfo
}

export class Result extends React.Component<Props, State> {
    private reportID = this.props.match.params.rid
    private fightID = parseInt(this.props.match.params.fid)
    private playerID = parseInt(this.props.match.params.pid)
    private gearsetID = this.props.match.params.gid

    private simulator: Simulator

    constructor(props: Props) {
        super(props)
        this.state = {
            ready: false,
            baseGearset: undefined,
        }
    }

    async componentDidMount() {
        await this.setup(this.reportID, this.fightID, this.gearsetID)
    }

    private async setup(reportID: string, fightID: number, gearsetID: string) {
        const parser = new FFLogsParser(reportID, fightID)
        await parser.init()

        const player = parser.fight.friends
            .filter((friend: Friend) => friend.id === this.playerID)[0]

        this.simulator = new Simulator(parser, player)

        await this.loadData(gearsetID)

        if (this.props.match.params.gid2) {
            await this.loadData(this.props.match.params.gid2, true)
        }
    }

    private async loadData(gearsetID: string, isCompare = false) {
        this.setState({ ready: false })

        const { name, stats } = await getStats(gearsetID)
        const damageArray = await this.simulator.calculateDamage(stats)

        const gearsetInfo: GearsetInfo = {
            name: name,
            stats: stats,
            expected: damageArray.slice(-1)[0].y,
            data: { id: name, data: damageArray },
        }

        if (isCompare) {
            this.setState({ compareGearset: gearsetInfo, ready: true })
        } else {
            this.setState({ baseGearset: gearsetInfo, ready: true })
        }
    }

    private onSetSelect = async (etroLink: string) => {
        const gearsetRegex = /(?<=gearset\/)(.*)/i

        try {
            const url = new URL(etroLink)
            const gearsetID = url.pathname.match(gearsetRegex)[0]

            await this.loadData(gearsetID, true)

            this.props.history.replace(this.props.location.pathname + '/' + gearsetID)

        } catch (e) {
            return
        }
    }

    private onSync = async () => {
        await this.loadData(this.props.match.params.gid2, true)
    }

    private onClear = async () => {
        const reportID = this.props.match.params.rid
        const fightID = parseInt(this.props.match.params.fid)
        const playerID = parseInt(this.props.match.params.pid)
        const gearsetID = this.props.match.params.gid

        this.setState({ compareGearset: undefined })

        this.props.history.replace(`/${reportID}/${fightID}/${playerID}/${gearsetID}`)
    }

    private comparePanel = () => {
        if (this.state.compareGearset) {
            return <div>
                <ComparisonPanel gearset={this.state.baseGearset} compare={this.state.compareGearset} />
                <Box className={styles.buttons}>
                    <IconButton onClick = {this.onSync}>
                        <Sync />
                    </IconButton>
                    <IconButton onClick={this.onClear}>
                        <Clear />
                    </IconButton>
                </Box>
            </div>
        }
        return <SetSelect onClick={this.onSetSelect} />
    }

    private getGearsets = () => {
        return this.state.compareGearset ?
            [this.state.baseGearset, this.state.compareGearset] :
            [this.state.baseGearset]
    }

    render() {
        if (!this.state.ready) {
            return <CircularProgress size={80} className={styles.loading} />
        }

        return <div className={styles.result}>
            <Paper>
                <Box p={2}>
                    <DamageGraph gearsets={this.getGearsets()} />
                </Box>
            </Paper>
            <Box mt={2} overflow="hidden">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <BasePanel gearset={this.state.baseGearset} />
                    </Grid>
                    <Grid item xs={6}>
                        {this.comparePanel()}
                    </Grid>
                </Grid>
            </Box>
        </div>
    }
}
