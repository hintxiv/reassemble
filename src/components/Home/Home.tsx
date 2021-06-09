import { Paper, Grid, TextField, Button, Box } from '@material-ui/core'
import { fetchLastFightID } from 'parse/fflogs/api'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styles from './Home.module.css'

type Props = RouteComponentProps
interface State {
    fflogs?: string
    etro?: string
}

export class Home extends React.Component<Props, State> {
    private decomposeFFLogsURL(url: URL): { reportID: string, fightID: string } {
        const reportRegex = /(?<=reports\/)(?:(?!\/).)+/i
        const fightRegex = /(?<=#fight=)(?:(?!&).)+/i

        const reportID = url.pathname.match(reportRegex)
        const fightID = url.hash.match(fightRegex)

        if (reportID.length === 0) {
            // TODO give some friendly message...
        }

        return {
            reportID: reportID[0],
            fightID: fightID[0],
        }
    }

    private decomposeEtroURL(url: URL): string {
        const gearsetRegex = /(?<=gearset\/)(.+)/i

        const gearsetID = url.pathname.match(gearsetRegex)

        if (gearsetID.length === 0) {
            // TODO give some friendly message...
        }

        return gearsetID[0]
    }

    private onFFlogsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ fflogs: event.target.value })
    }

    private onEtroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ etro: event.target.value })
    }

    private onClick = async () => {
        let fflogsLink, etroLink

        try {
            fflogsLink = new URL(this.state.fflogs)
            etroLink = new URL(this.state.etro)
        } catch (e) {
            return
        }

        const { reportID, fightID } = this.decomposeFFLogsURL(fflogsLink)
        const gearsetID = this.decomposeEtroURL(etroLink)

        let parsedFightID
        if (fightID === 'last') {
            parsedFightID = await fetchLastFightID(reportID)
        } else {
            parsedFightID = parseInt(fightID)
        }

        this.props.history.push(`/${reportID}/${parsedFightID}/${gearsetID}`)
    }

    render() {
        return <div className={styles.home}>
            <Paper>
                <Box p={2}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="fflogs"
                                label="FFLogs Link"
                                variant="outlined"
                                placeholder="https://www.fflogs.com/reports/..."
                                fullWidth
                                onChange={this.onFFlogsChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item md={true} sm={true} xs={true}>
                            <TextField
                                id="etro"
                                label="Etro Link"
                                variant="outlined"
                                placeholder="https://etro.gg/gearset/..."
                                fullWidth
                                onChange={this.onEtroChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justify="center" style={{ marginTop: '10px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ textTransform: 'none' }}
                            onClick={this.onClick}
                        >
                            Simulate
                        </Button>
                    </Grid>
                </Box>
            </Paper>
        </div>
    }
}
