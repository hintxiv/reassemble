import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, CircularProgress, Grid, Paper } from '@material-ui/core'
import { DamageGraph, GraphData } from './DamageGraph'
import { getStats } from 'parse/etro/api'
import { FFLogsParser } from 'parse/fflogs/parser'
import { Friend } from 'parse/fflogs/fight'
import { Stats } from 'simulator/entity/player/stats'
import { Simulator } from 'simulator/simulator'
import { SetSelect } from './Stats/SetSelect'
import { StatsTable } from './Stats/GearsetPanel'

import styles from './Result.module.css'
import { LiveTvOutlined } from '@material-ui/icons'

interface RouterProps 
{
    rid: string
    fid: string
    pid: string
    gid: string
    gid2?: string
}

interface Props extends RouteComponentProps<RouterProps> {}

export interface GearsetInfo
{
    name: string
    expected: number
    stats: Stats
    data: GraphData
}

interface State
{
    ready: boolean
    gearsets: GearsetInfo[]
}

export class Result extends React.Component<Props, State>
{
    private reportID = this.props.match.params.rid
    private fightID = parseInt(this.props.match.params.fid)
    private playerID = parseInt(this.props.match.params.pid)
    private gearsetID = this.props.match.params.gid

    private simulator: Simulator

    constructor(props: Props) {
        super(props)
        this.state = { 
            ready: false,
            gearsets: [],
        }
    }

    // componentWillMount?
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
            await this.loadData(this.props.match.params.gid2)
        }
    }

    private async loadData(gearsetID: string) {
        this.setState({ ready: false })

        let {name, stats} = await getStats(gearsetID)

        /* #region hackyzone */

        // HACKY SET 2 OVERWRITE
        //if (this.state.gearsets.length > 0) {
        //    stats.critical = 3994
        //    stats.direct = 3050
        //    stats.determination = 2017
        //    stats.vitality = 6538
        //    stats.skillspeed = 710
        //    stats.dexterity = 5605
        //    stats.weapondamage = 134
        //
        //    name = "Jisoo's set"
        //}

        //
        //// HACKY SET 1 OVERWRITE
        //else {
        //    stats.critical = 3812
        //    stats.direct = 3411
        //    stats.determination = 2168
        //    stats.vitality += 836
        //    stats.dexterity += 725
        //    stats.weapondamage += 134
        //}

        //stats.critical = 2888
        //stats.dexterity = 3759 + 544
        //stats.skillspeed = 914
        //stats.weapondamage = 130
        //
        //const leftover = 1182 - 451
        //
        //let lastDps = 0
        //let bestDps = 0
        //
        //stats.determination = 2491 + leftover
        //stats.direct = 1991
        //
        //while (stats.direct <= 2171 + 467) {
        //    stats.determination -= 1
        //    stats.direct += 1
        //    const damageArray = await this.simulator.calculateDamage(stats)
        //    const dps = damageArray.slice(-1)[0].y
        //
        //    if (dps !== lastDps) {
        //        lastDps = dps
        //        console.log(`${stats.determination}\t${stats.direct}\t${dps}`)
        //    
        //        if (dps > bestDps) {
        //            bestDps = dps
        //            //console.log(`new best found: ${dps} at det: ${stats.determination}, dh: ${stats.direct}`)
        //        }
        //    }
        //}       
        /* #endregion */

        const damageArray = await this.simulator.calculateDamage(stats)

        const gearsetInfo: GearsetInfo = {
            name: name,
            stats: stats,
            expected: damageArray.slice(-1)[0].y,
            data: {id: name, data: damageArray},
        }

        this.setState({
            gearsets: [...this.state.gearsets, gearsetInfo],
            ready: true,
        })
    }

    private etroLinkCallback = async (etroLink: string) => {
        const gearsetRegex = /(?<=gearset\/)(.*)/i

        try {
            const url = new URL(etroLink)
            const gearsetID = url.pathname.match(gearsetRegex)[0]

            await this.loadData(gearsetID)

            this.props.history.push(this.props.location.pathname + '/' + gearsetID)

        } catch (e) {
            return
        }
    }

    private statsPanel = () => {
        if (this.state.gearsets.length === 2) {
            return <StatsTable gearset={this.state.gearsets[1]} compare={this.state.gearsets[0]} />
        }
        return <SetSelect onClick={this.etroLinkCallback}/>
    }

    render() {
        if (!this.state.ready) { 
            return <CircularProgress size={80} className={styles.loading} /> 
        }

        return <div className={styles.result}>
            <Paper>
                <Box p={2}>
                    <DamageGraph gearsets={this.state.gearsets} />
                </Box>
            </Paper>
            <Box mt={2} overflow="hidden">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <StatsTable gearset={this.state.gearsets[0]} />
                    </Grid>
                    <Grid item xs={6}>
                        {this.statsPanel()}
                    </Grid> 
                </Grid>
            </Box>
        </div>
    }
}
