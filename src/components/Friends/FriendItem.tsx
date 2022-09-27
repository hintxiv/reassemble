import { Box, Button, createStyles, Icon, Theme, WithStyles, withStyles } from '@material-ui/core'
import { Friend } from 'api/fflogs/fight'
import { JobInfo, JOBS } from 'data/jobs'
import { CURRENT } from 'data/patch'
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
    friend: Friend
    selected: boolean
    onClick: (friend: Friend) => Promise<void>
}

interface State {
    job: JobInfo | null
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

    private onClick = () => {
        this.props.onClick(this.props.friend)
    }

    render() {
        return <Box mb={1}>
            <Button
                variant="contained"
                startIcon={this.getIcon()}
                onClick={this.onClick}
                disabled={!this.isAvailable()}
                color={this.props.selected ? 'primary' : 'inherit'}
                fullWidth
            >
                {this.props.friend.name}
            </Button>
        </Box>
    }
}

export const FriendItem = withStyles(styles)(FriendItemComponent)
