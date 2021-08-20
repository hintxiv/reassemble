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
    typography: {
        fontFamily: 'Nunito',
    },
})

const routes = [
    {
        path: '/',
        component: Home,
        crumb: () => <Typography variant="subtitle1">Home</Typography>,
    },
    {
        path: '/:rid/:fid',
        component: FriendSelect,
        crumb: (fight: string) => <Typography variant="subtitle2">{fight}</Typography>,
    },
    {
        path: '/:rid/:fid/:pid',
        component: Result,
        crumb: (player: string) => <Typography variant="subtitle2">{player}</Typography>,
    },
]

class AppComponent extends React.Component<RouteComponentProps> {
    private goHome = () => {
        if (this.props.location.pathname !== '/') {
            this.props.history.push('/')
        }
    }

    render() {
        return <ThemeProvider theme={theme}>
            <AppBar style={{ alignItems: 'center' }}>
                <Toolbar>
                    <Typography variant="h5" align="center" onClick={this.goHome}>
                        Reassemble
                    </Typography>
                </Toolbar>
            </AppBar>
            <Switch>
                {routes.map(({ path, component }, key) => (
                    <Route exact path={path} key={key} component={component} />
                ))}
            </Switch>
        </ThemeProvider>
    }
}

export const App = withRouter(AppComponent)
