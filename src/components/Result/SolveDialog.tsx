import {
    Button,
    CircularProgress,
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
    onClose: (gearset: Gearset) => void
}

export function SolveDialog(props: Props): JSX.Element {
    const [open, setOpen] = useState(true)
    const [recast, setRecast] = useState(props.recast)

    const onRecastChange = (validRecast: boolean, recast: number) => {
        if (validRecast) {
            setRecast(recast)
        }
    }

    const handleSolve = async () => {
        const gearset = await solveMateria(props.gearset, props.simulator, recast)
        props.onClose(gearset)
    }

    return <Dialog open={open}>
        <DialogTitle>
            Solve Melds
        </DialogTitle>
        <DialogContent style={{ width: '25rem' }}>
            <Typography>Target GCD</Typography>
            <RecastSelect recast={props.recast} onChange={onRecastChange} />
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleSolve}>
                Solve
            </Button>
            <Button onClick={() => setOpen(false)}>
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
}
