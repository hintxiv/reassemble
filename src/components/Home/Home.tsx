import { Grid, TextField, Box, Typography } from '@material-ui/core'
import { fetchLastFightID } from 'api/fflogs/api'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styles from './Home.module.css'

type Props = RouteComponentProps
interface State {
    hasError: boolean
}

export class Home extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
        }
    }

    private decomposeFFLogsURL(url: URL): { reportID: string, fightID: string } {
        const reportRegex = /(?<=reports\/)(?:(?!\/).)+/i
        const fightRegex = /(?<=#fight=)(?:(?!&).)+/i

        const reportID = url.pathname.match(reportRegex)
        const fightID = url.hash.match(fightRegex)

        return {
            reportID: reportID[0],
            fightID: fightID[0],
        }
    }

    private onFFlogsChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === '') {
            // Empty field, reset state
            this.setState({ hasError: false })
        }

        try {
            const url = new URL(event.target.value)
            const { reportID, fightID } = this.decomposeFFLogsURL(url)

            let parsedFightID = parseInt(fightID)
            if (fightID === 'last') {
                parsedFightID = await fetchLastFightID(reportID)
            }

            this.props.history.push(`/${reportID}/${parsedFightID}`)

        } catch (e) {
            this.setState({ hasError: true })
            return
        }
    }

    render() {
        return <div className={styles.home}>
            <Box p={2}>
                <Box mb={1}>
                    {this.state.hasError ?
                        <Typography color="error">
                            * Not a valid FFLogs report url.
                        </Typography> : <Typography color="textPrimary">
                            Enter your FFLogs report link to get started.
                        </Typography>
                    }
                </Box>
                <Grid container spacing={8} alignItems="flex-end">
                    <Grid item md={true} sm={true} xs={true}>
                        <TextField
                            id="fflogs"
                            variant="outlined"
                            placeholder="https://www.fflogs.com/reports/..."
                            fullWidth
                            onChange={this.onFFlogsChange}
                        />
                    </Grid>
                </Grid>
            </Box>
        </div>
    }
}
