import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'
import { formatDamage, PROPER_STAT_NAME } from '../format'
import { GearsetInfo } from '../Result'
import { GearsetPanel } from './GearsetPanel'

export interface Props {
    gearset: GearsetInfo
}

export class BasePanel extends React.Component<Props> {
    private stats = this.props.gearset.stats
    private result = formatDamage(this.props.gearset.expected)

    private makeStatRow = (stat: keyof Stats) => {
        return <TableRow key={`${stat}-base`}>
            <TableCell component="th" scope="row">
                {PROPER_STAT_NAME[stat]}
            </TableCell>
            <TableCell align="right" width="10%">
                <Typography>
                    {this.stats[stat]}
                </Typography>
            </TableCell>
        </TableRow>
    }

    render() {
        return <GearsetPanel gearset={this.props.gearset} result={this.result}>
            <Table>
                <TableBody>
                    {Object.keys(this.stats)
                        .filter((stat: keyof Stats) => this.stats[stat] !== 0)
                        .map((stat: keyof Stats) => this.makeStatRow(stat))
                    }
                </TableBody>
            </Table>
        </GearsetPanel>
    }
}
