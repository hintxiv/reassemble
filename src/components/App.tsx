import { AppBar, createMuiTheme, ThemeProvider, Toolbar, Typography } from '@material-ui/core'
import { blue } from '@material-ui/core/colors'
import * as React from 'react'
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom'
import { FriendSelect } from './Friends/FriendSelect'
import { Home } from './Home/Home'
import { Result } from './Result/Result'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: blue[900],
        },
    },
})

class AppComponent extends React.Component<RouteComponentProps> {
    private wantsToGoHome = () => {
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/')
        }
    }

    render() {
        return <ThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    <Typography variant="h5" onClick={this.wantsToGoHome}>
                        Reassemble
                    </Typography>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/:rid/:fid/:gid" component={FriendSelect} />
                <Route exact path="/:rid/:fid/:pid/:gid/:gid2?" component={Result} />
            </Switch>
        </ThemeProvider>
    }
}

export const App = withRouter(AppComponent)
