import { Box, Button, Grid, TextField, Typography } from '@material-ui/core'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { FriendItem } from './FriendItem'
import styles from './FriendSelect.module.css'

const BASE_RECAST = 2500
const MIN_RECAST = 1500

interface RouterProps {
    rid: string
    fid: string
}

type Props = RouteComponentProps<RouterProps>

interface State {
    friends?: Friend[]
    selected?: Friend
    recast: number
    invalidRecast: boolean
}

export class FriendSelect extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            recast: BASE_RECAST,
            invalidRecast: false,
        }
    }

    async componentDidMount() {
        await this.setup(this.props.match.params.rid, parseInt(this.props.match.params.fid))
    }

    private async setup(reportID: string, fightID: number) {
        const parser = new FFLogsParser(reportID, fightID)
        await parser.init()

        this.setState({ friends: parser.fight.friends })
    }

    private onFriendClick = async (friend: Friend) => {
        this.setState({ selected: friend })
    }

    private onRecastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const recast = parseFloat(event.target.value) * 1000

        if (recast >= MIN_RECAST && recast <= BASE_RECAST) {
            this.setState({
                recast: recast,
                invalidRecast: false,
            })

        } else {
            this.setState({ invalidRecast: true })
        }
    }

    private onReassembleClick = () => {
        const reportID = this.props.match.params.rid
        const fightID = parseInt(this.props.match.params.fid)
        const playerID = this.state.selected.id
        const recast = this.state.recast

        // Route to the table view
        this.props.history.push(`/${reportID}/${fightID}/${playerID}/${recast}`)
    }

    render() {
        if (!this.state.friends) {
            return <div />
        }

        return <div className={styles.friendSelect}>
            <Grid container spacing={3} className={styles.friends}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" color="textPrimary">
                        1. Choose a player
                    </Typography>
                </Grid>
                <Grid container spacing={3} className={styles.friends}>
                    {this.state.friends.map(friend =>
                        <Grid item xs={12} sm={6} md={3} key={friend.id}>
                            <FriendItem
                                friend={friend}
                                selected={friend === this.state.selected}
                                onClick={this.onFriendClick}
                            />
                        </Grid>
                    )}
                </Grid>
                <Typography color="error">
                    * Greyed out jobs are not yet supported.
                </Typography>
            </Grid>
            <Box className={styles.recast}>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" color="textPrimary">
                            2. Enter your GCD recast
                        </Typography>
                    </Grid>
                    <Box mb={2}>
                        <TextField
                            id="gcd"
                            variant="outlined"
                            color="primary"
                            size="small"
                            defaultValue={(this.state.recast / 1000).toFixed(2)}
                            inputProps={{ style: { textAlign: 'center' } }}
                            style={{ width: 80 }}
                            error={this.state.invalidRecast}
                            onChange={this.onRecastChange}
                        />
                    </Box>
                </Grid>
                {this.state.invalidRecast &&
                    <Typography color="error" align="center">
                        * A valid recast must be between 1.50s and 2.50s.
                    </Typography>
                }
            </Box>
            <Box className={styles.button}>
                <Grid container justify="center">
                    <Button
                        id="reassemble"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={!this.state.selected || this.state.invalidRecast}
                        onClick={this.onReassembleClick}
                    >
                        Reassemble!
                    </Button>
                </Grid>
            </Box>
        </div>
    }
}
