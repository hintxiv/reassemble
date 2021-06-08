import * as React from 'react'
import { Paper, TextField } from '@material-ui/core'

interface Props
{
    onClick: Function
}

export class SetSelect extends React.Component<Props>
{
    private onEtroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onClick(event.target.value)
    }

    render() {
        return <Paper>
            <TextField 
                id="etro"
                label="Compare..."
                variant="outlined"
                placeholder="https://etro.gg/gearset/..."
                fullWidth
                onChange={this.onEtroChange}
            />
        </Paper>
    }
}
