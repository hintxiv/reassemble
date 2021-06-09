import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'
import { GearsetInfo } from '../Result'
import { Format, GearsetPanel } from './GearsetPanel'

export interface Props {
    gearset: GearsetInfo
}

export class BasePanel extends React.Component<Props> {
    private name = this.props.gearset.name
    private stats = this.props.gearset.stats
    private result = this.props.gearset.expected.toFixed(2)

    private makeStatRow = (stat: keyof Stats) => {
        return <TableRow key={`${stat}-base`}>
            <TableCell component="th" scope="row">
                {Format[stat]}
            </TableCell>
            <TableCell align="right" width="10%">
                <Typography>
                    {this.stats[stat]}
                </Typography>
            </TableCell>
        </TableRow>
    }

    render() {
        return <GearsetPanel name={this.name} result={this.result}>
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
