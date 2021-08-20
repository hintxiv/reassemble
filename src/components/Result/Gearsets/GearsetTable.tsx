import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'
import { PROPER_STAT_NAME, SHORT_STAT_NAME } from 'utilities/format'
import { GearsetInfo } from '../Result'
import { EtroRow } from './EtroRow'
import { GearsetRow } from './GearsetRow'
import styles from './GearsetTable.module.css'

interface Props {
    gearsets: GearsetInfo[]
    loadGearset: (gearsetID: string) => Promise<void>
    removeGearset: (gearset: GearsetInfo) => Promise<void>
    updateGearset: (gearset: GearsetInfo, stats: Stats, name: string) => Promise<void>
    cloneGearset: (gearset: GearsetInfo) => Promise<void>
}

interface State {
    selected: GearsetInfo
}

export class GearsetTable extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            selected: this.props.gearsets[0],
        }
    }

    componentDidUpdate() {
        if (!this.props.gearsets.includes(this.state.selected)) {
            // Selected set got deleted, default to the top set
            this.setState({
                selected: this.props.gearsets[0],
            })
        }
    }

    private getStats(): Array<keyof Stats> {
        const stats: Array<keyof Stats> = []

        this.props.gearsets.forEach(set => {
            // Why is typescript?
            (Object.keys(set.stats) as Array<keyof Stats>).forEach(stat => {
                if (set.stats[stat] > 0 && !stats.includes(stat)) {
                    stats.push(stat)
                }
            })
        })

        return stats
    }

    private selectRow = async (gearset: GearsetInfo) => {
        this.setState({ selected: gearset })
    }

    render() {
        return <Grid container spacing={2} justify="center">
            <Grid item xs={12}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.name}>
                                <Typography>
                                    Set
                                </Typography>
                            </TableCell>
                            <TableCell className={styles.relative} align="center">
                                <Typography>
                                    Relative
                                </Typography>
                            </TableCell>
                            <TableCell className={styles.expected} align="center">
                                <Typography>
                                    Expected
                                </Typography>
                            </TableCell>
                            {this.getStats().map(stat =>
                                <TableCell key={stat} className={styles.stat} align="center">
                                    <Tooltip key={stat} title={PROPER_STAT_NAME[stat]}>
                                        <Typography>
                                            {SHORT_STAT_NAME[stat]}
                                        </Typography>
                                    </Tooltip>
                                </TableCell>
                            )}
                            <TableCell className={styles.actions} align="center">
                                <Typography>
                                    Actions
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.gearsets.map(set => <GearsetRow
                            key={set.id}
                            gearset={set}
                            selected={this.state.selected}
                            stats={this.getStats()}
                            selectRow={this.selectRow}
                            removeGearset={this.props.removeGearset}
                            updateGearset={this.props.updateGearset}
                            cloneGearset={this.props.cloneGearset}
                        />)}
                    </TableBody>
                </Table>
            </Grid>
            <Grid item xs={12}>
                <EtroRow loadGearset={this.props.loadGearset} />
            </Grid>
        </Grid>
    }
}
