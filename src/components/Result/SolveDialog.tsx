import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@material-ui/core'
import { RecastSelect } from 'components/RecastSelect/RecastSelect'
import React, { useState } from 'react'
import { Gearset } from 'simulator/gear/gear.js'
import { Simulator } from 'simulator/simulator'
import { solveMateria } from 'solve/solveMateria'
import { GearsetInfo } from './Result'

interface Props {
    gearset: GearsetInfo
    simulator: Simulator
    recast: number
    onSolve: (gearset: Gearset) => void
    onClose: () => void
}

export function SolveDialog(props: Props): JSX.Element {
    const [recast, setRecast] = useState(props.recast)

    const onRecastChange = (validRecast: boolean, recast: number) => {
        if (validRecast) {
            setRecast(recast)
        }
    }

    const handleSolve = async () => {
        const gearset = await solveMateria(props.gearset, props.simulator, recast)
        props.onSolve(gearset)
    }

    return <Dialog open={true}>
        <DialogTitle>
            Solve Melds
        </DialogTitle>
        <DialogContent style={{ width: '15rem' }}>
            <Typography style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Target GCD</Typography>
            <RecastSelect
                inputProps={{
                    style: {
                        width: '5rem',
                        textAlign: 'center',
                    },
                }}
                recast={props.recast}
                onChange={onRecastChange}
            />
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleSolve}>
                Solve
            </Button>
            <Button onClick={props.onClose}>
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
}
