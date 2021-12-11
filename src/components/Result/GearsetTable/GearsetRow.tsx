import { Box, IconButton, TableCell, TableRow, TextField, Tooltip, Typography } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FunctionsIcon from '@material-ui/icons/Functions'
import { fGCD } from 'functions/functions'
import * as React from 'react'
import { Stats } from 'simulator/gear/stats'
import { formatDamage } from 'utilities/format'
import { GearsetInfo } from '../Result'
import styles from './GearsetTable.module.css'

const TIERED_COLORS = [
    {
        TIER: 0.02,
        NEGATIVE: 'hsl(0, 60%, 60%)',
        POSITIVE: 'hsl(120, 60%, 60%)',
    },
    {
        TIER: 0.01,
        NEGATIVE: 'hsl(40, 60%, 60%)',
        POSITIVE: 'hsl(150, 60%, 60%)',
    },
    {
        TIER: 0.0002,
        NEGATIVE: 'hsl(55, 60%, 60%)',
        POSITIVE: 'hsl(170, 60%, 60%)',
    },
    {
        TIER: 0,
        POSITIVE: 'hsl(0, 0%, 100%)',
    },
]

interface Props {
    gearset: GearsetInfo
    selected: GearsetInfo
    stats: Array<keyof Stats>
    recast: number
    selectRow: (gearset: GearsetInfo) => Promise<void>
    removeGearset: (gearset: GearsetInfo) => Promise<void>
    updateGearset: (gearset: GearsetInfo, stats: Stats, name: string) => Promise<void>
    cloneGearset: (gearset: GearsetInfo) => Promise<void>
    solveMelds: (gearset: GearsetInfo) => Promise<void>
}

interface State {
    editMode: boolean
    editedStats: Stats
    editedName: string
}

export class GearsetRow extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            editMode: false,
            editedStats: {...props.gearset.stats},
            editedName: props.gearset.name,
        }
    }

    private onStatChange(stat: keyof Stats) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseInt(event.target.value)

            if (Number.isNaN(newValue) || newValue < 0) {
                return
            }

            const editedStats = {...this.state.editedStats}
            editedStats[stat] = newValue

            this.setState({ editedStats: editedStats })
        }
    }

    private onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ editedName: event.target.value })
    }

    private onEdit = () => {
        this.props.updateGearset(this.props.gearset, this.state.editedStats, this.state.editedName)
        this.setState({ editMode: false })
    }

    private renderRelativeDamage() {
        const expected = this.props.gearset.expected
        const compare = this.props.selected.expected
        const delta = (expected - compare) / compare

        const tier = TIERED_COLORS.find(t => Math.abs(delta) >= t.TIER)
        const color = delta < 0 ? tier.NEGATIVE : tier.POSITIVE

        let relative: string

        if (delta === 0) {
            relative = '-'
        } else {
            relative = `${(delta * 100).toFixed(2)}%`
        }

        return <span>
            <Box style={{ color: color }}>
                <Typography>
                    {relative}
                </Typography>
            </Box>
        </span>
    }

    private renderStat(stat: keyof Stats) {
        const setStats = this.props.gearset.stats
        const speedStat = this.props.stats.includes('skillspeed') ? 'skillspeed' : 'spellspeed'
        // TODO level stuff
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const gearsetRecast = fGCD(setStats[speedStat], 90)

        if (stat !== speedStat || gearsetRecast === this.props.recast) {
            return <Typography>
                {setStats[stat]}
            </Typography>
        }

        return <Tooltip title="GCD recast mismatch; results will be inaccurate!">
            <Typography color="error">
                {setStats[stat]}*
            </Typography>
        </Tooltip>
    }

    render() {
        const set = this.props.gearset
        const select = () => this.props.selectRow(this.props.gearset)

        return <TableRow selected={this.state.editMode}>
            <TableCell className={styles.name} onClick={select}>
                {this.state.editMode ?
                    <TextField
                        size="small"
                        defaultValue={set.name}
                        fullWidth
                        onChange={this.onNameChange}
                    />
                    : <Typography>
                        {set.name}
                    </Typography>
                }
            </TableCell>
            <TableCell className={styles.relative} onClick={select} align="center">
                {this.renderRelativeDamage()}
            </TableCell>
            <TableCell className={styles.expected} onClick={select} align="center">
                <Tooltip title={'Total: ' + formatDamage(set.total)}>
                    <Typography>
                        {formatDamage(set.expected)}
                    </Typography>
                </Tooltip>
            </TableCell>
            {this.props.stats.map(stat =>
                <TableCell key={stat} className={styles.stat} onClick={select} align="center">
                    {this.state.editMode ?
                        <TextField
                            size="small"
                            type="number"
                            defaultValue={set.stats[stat]}
                            InputProps={{ style: { fontSize: 14 } }}
                            onChange={this.onStatChange(stat)}
                        />
                        : this.renderStat(stat)
                    }
                </TableCell>
            )}
            <TableCell className={styles.actions} align="center">
                {this.state.editMode ?
                    <Tooltip title="Save">
                        <IconButton size="small" onClick={this.onEdit}>
                            <DoneIcon />
                        </IconButton>
                    </Tooltip>
                    : <>
                        <Tooltip title="Edit" onClick={() => this.setState({ editMode: true })}>
                            <IconButton size="small">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Clone">
                            <IconButton size="small" onClick={() => this.props.cloneGearset(set)}>
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove">
                            <IconButton size="small" onClick={() => this.props.removeGearset(set)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Solve Melds">
                            <IconButton size="small" onClick={() => this.props.solveMelds(set)}>
                                <FunctionsIcon />
                            </IconButton>
                        </Tooltip>
                    </>}
            </TableCell>
        </TableRow>
    }
}
