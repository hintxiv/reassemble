import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@material-ui/core'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import { getTiers, TieredStat } from 'math/tiers'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'
import { GearsetInfo } from '../Result'

const Format: Record<keyof Stats, string> = {
    weapondamage: 'Weapon Damage',
    vitality: 'Vitality',
    strength: 'Strength',
    dexterity: 'Dexterity',
    intelligence: 'Intelligence',
    mind: 'Mind',
    critical: 'Critical Hit',
    determination: 'Determination',
    direct: 'Direct Hit',
    skillspeed: 'Skill Speed',
    spellspeed: 'Spell Speed',
    tenacity: 'Tenacity',
}

interface Props {
    gearset: GearsetInfo
    compare?: GearsetInfo
}

export class StatsTable extends React.Component<Props> {
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

    private formatDamage = (damage: number, compare?: number) => {
        if (!compare) {
            return damage.toFixed(2)
        }

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

    // Please rewrite this oh my GOD
    private formatStatDelta = (stat: keyof Stats, first: number, second: number) => {
        if (['weapondamage', 'weapondelay', 'vitality', 'tenacity'].includes(stat)) {
            return this.formatDelta((second - first) / first)
        }

        const tierDelta = getTiers(stat as TieredStat, first, second)

        if (tierDelta === 0) { return }

        const icon = tierDelta > 0 ? this.gainIcon : this.lossIcon
        return <span>{tierDelta} tiers {icon}</span>
    }

    private makeStatRow = (stat: keyof Stats) => {
        let deltaRow
        if (this.props.compare) {
            deltaRow = <TableCell align="right">
                <Typography color="textSecondary">
                    {this.formatStatDelta(stat, this.props.compare.stats[stat], this.stats[stat])}
                </Typography>
            </TableCell>
        }

        return <TableRow key={stat}>
            <TableCell component="th" scope="row">
                {Format[stat]}
            </TableCell>
            {deltaRow}
            <TableCell align="right" width="10%"><Typography>{this.stats[stat]}</Typography></TableCell>
        </TableRow>
    }

    render() {
        return <TableContainer component={Paper}>
            <Box m={2}>
                <Typography variant="h5" align="center">
                    {this.name}
                </Typography>
                <Typography variant="h6">
                    Expected DPS: {this.formatDamage(this.props.gearset.expected, this.props.compare?.expected)}
                </Typography>
            </Box>
            <Table>
                <TableBody>
                    {Object.keys(this.stats)
                        .filter((stat: keyof Stats) => this.stats[stat] !== 0)
                        .map((stat: keyof Stats) => this.makeStatRow(stat))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    }
}
