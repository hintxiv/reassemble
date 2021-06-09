import { Box, Paper, TableContainer, Typography } from '@material-ui/core'
import * as React from 'react'
import { Stats } from 'simulator/entity/player/stats'

export const Format: Record<keyof Stats, string> = {
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
    name: string
    result: React.ReactNode
    children: React.ReactNode
}

export class GearsetPanel extends React.Component<Props> {
    render() {
        return <TableContainer component={Paper}>
            <Box m={2}>
                <Typography variant="h5" align="center">
                    {this.props.name}
                </Typography>
                <Typography variant="h6">
                    Expected DPS: {this.props.result}
                </Typography>
            </Box>
            {this.props.children}
        </TableContainer>
    }
}
