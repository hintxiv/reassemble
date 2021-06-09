import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core'
import { ArrowDownward, ArrowUpward } from '@material-ui/icons'
import { getTiers, TieredStat, TIERED_STATS } from 'math/tiers'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'
import { GearsetInfo } from '../Result'
import { Format, GearsetPanel } from './GearsetPanel'

export interface Props {
    gearset: GearsetInfo
    compare: GearsetInfo
}

export class ComparisonPanel extends React.Component<Props> {
    private name = this.props.gearset.name
    private stats = this.props.gearset.stats

    private gainIcon = <ArrowUpward htmlColor="green" fontSize="small" style={{ position: 'relative', verticalAlign: '-4px' }} />
    private lossIcon = <ArrowDownward htmlColor="red" fontSize="small" style={{ position: 'relative', verticalAlign: '-4px' }} />

    private formatDelta = (delta: number, brackets = false) => {
        if (delta === 0) {
            return
        }

        const formatted = `${(delta * 100).toFixed(2)}%`
        const icon = delta > 0 ? this.gainIcon : this.lossIcon

        if (brackets) {
            return <span>( {formatted}{icon})</span>
        }
        return <span>{formatted}{icon}</span>
    }

    private formatDamage = (damage: number, compare: number) => {
        const delta = (damage - compare) / compare
        return <span>
            {damage.toFixed(2)}
            <Box display="inline" ml={1}>
                <Typography display="inline" color="textSecondary" style={{ verticalAlign: '2px' }}>
                    {this.formatDelta(delta, true)}
                </Typography>
            </Box>
        </span>
    }

    private formatStatDelta = (stat: keyof Stats, first: number, second: number) => {
        if (!TIERED_STATS.includes(stat)) {
            return this.formatDelta((second - first) / first)
        }

        const tierDelta = getTiers(stat as TieredStat, first, second)

        if (tierDelta === 0) { return }

        const icon = tierDelta > 0 ? this.gainIcon : this.lossIcon
        return <span>{tierDelta} tiers {icon}</span>
    }

    private makeStatRow = (stat: keyof Stats) => {
        return <TableRow key={`${stat}-compare`}>
            <TableCell component="th" scope="row">
                {Format[stat]}
            </TableCell>
            <TableCell align="right">
                <Typography color="textSecondary">
                    {this.formatStatDelta(stat, this.props.compare.stats[stat], this.stats[stat])}
                </Typography>
            </TableCell>
            <TableCell align="right" width="10%"><Typography>{this.stats[stat]}</Typography></TableCell>
        </TableRow>
    }

    render() {
        return <GearsetPanel name={this.name} result={this.formatDamage(this.props.gearset.expected, this.props.compare.expected)}>
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
