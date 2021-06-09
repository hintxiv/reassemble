import { Button, createStyles, Icon, Theme, WithStyles, withStyles } from '@material-ui/core'
import { JobInfo, JOBS } from 'data/jobs'
import { CURRENT } from 'data/patch'
import { Friend } from 'parse/fflogs/fight'
import * as React from 'react'

const styles = (_theme: Theme) => createStyles({
    imageIcon: {
        display: 'flex',
        height: 'inherit',
        width: 'inherit',
    },
    iconRoot: {
        textAlign: 'center',
    },
})

interface Props extends WithStyles<typeof styles> {
    onClick: (playerID: number) => Promise<void>,
    friend: Friend,
}

interface State {
    job: JobInfo | null,
}

class FriendItemComponent extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            job: JOBS[this.props.friend.type],
        }
    }

    private isAvailable = () => {
        const job = this.state.job
        if (job) {
            return (job.latest.major >= CURRENT.major) && (job.latest.minor >= CURRENT.minor)
        }
        return false
    }

    private getIcon = () => {
        const job = this.state.job
        if (job) {
            return <Icon className={this.props.classes.iconRoot}>
                <img className={this.props.classes.imageIcon} src={job.iconPath} />
            </Icon>
        }
    }

    private sendPlayerID = () => {
        this.props.onClick(this.props.friend.id)
    }

    render() {
        return <div>
            <Button
                startIcon={this.getIcon()}
                onClick={this.sendPlayerID}
                disabled={!this.isAvailable()}
            >
                {this.props.friend.name}
            </Button>
        </div>
    }
}

export const FriendItem = withStyles(styles)(FriendItemComponent)
