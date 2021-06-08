import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Box, Grid, Paper, Typography } from '@material-ui/core'
import { FriendItem } from './FriendItem'
import { FFLogsParser } from 'parse/fflogs/parser'
import { Friend } from 'parse/fflogs/fight'

import styles from './FriendSelect.module.css'

interface RouterProps
{
    rid: string
    fid: string
    gid: string
}

interface Props extends RouteComponentProps<RouterProps> {}

interface State
{
    friends?: Friend[]
}

export class FriendSelect extends React.Component<Props, State>
{
    constructor(props: Props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {
        await this.setup(this.props.match.params.rid, parseInt(this.props.match.params.fid))
    }

    private async setup(reportID: string, fightID: number) {
        const parser = new FFLogsParser(reportID, fightID)
        await parser.init()

        this.setState({ friends: parser.fight.friends })
    }

    private playerIDCallback = (playerID: number) => {
        const reportID = this.props.match.params.rid
        const fightID = parseInt(this.props.match.params.fid)
        const gearsetID = this.props.match.params.gid
        this.props.history.push(`/${reportID}/${fightID}/${playerID}/${gearsetID}`)
    }

    private getFriends = () => {
        return this.state.friends.map(friend =>
            <Grid item md={3} key={friend.id}>
                <FriendItem friend={friend} onClick={this.playerIDCallback} />
            </Grid>
        )
    }

    render() {
        if (!this.state.friends) { return <div /> }

        return <div className={styles.select}>
            <Paper>
                <Box p={2}>
                    <Grid container spacing={3}>
                        {this.getFriends()}
                    </Grid>
                </Box>
            </Paper>
        </div>
    }
}
