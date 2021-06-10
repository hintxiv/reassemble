import { Box, Link, Paper, TableContainer, Typography } from '@material-ui/core'
import * as React from 'react'
import { GearsetInfo } from '../Result'

interface Props {
    gearset: GearsetInfo
    result: React.ReactNode
    children: React.ReactNode
}

export class GearsetPanel extends React.Component<Props> {
    render() {
        return <TableContainer component={Paper}>
            <Box m={2}>
                <Typography variant="h5" align="center">
                    <Link color="inherit" href={`https://etro.gg/gearset/${this.props.gearset.id}`}>
                        {this.props.gearset.name}
                    </Link>
                </Typography>
                <Typography variant="h6">
                    Expected DPS: {this.props.result}
                </Typography>
            </Box>
            {this.props.children}
        </TableContainer>
    }
}
