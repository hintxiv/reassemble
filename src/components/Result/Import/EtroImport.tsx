import { Box, Button, TextField, Typography } from '@material-ui/core'
import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './Import.module.css'

interface Props {
    loadGearset: (gearsetID: string) => Promise<void>
}

interface State {
    showButton: boolean
    showField: boolean
    hasError: boolean
}

export class EtroImport extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            showButton: true,
            showField: false,
            hasError: false,
        }
    }

    private onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const etroLinkPattern = /(?<=gearset\/)(.*)/i

        if (event.target.value === '') {
            // No text, return to the button view
            this.setState({ showField: false })
        }

        try {
            const url = new URL(event.target.value)
            const gearsetID = url.pathname.match(etroLinkPattern)[0]
            await this.props.loadGearset(gearsetID)

            this.setState({ showField: false })

        } catch (e) {
            this.setState({ hasError: true })
            console.error(e)
            return
        }
    }

    render() {
        return <Box>
            <div className={styles.import}>
                {this.state.showButton &&
                    <Button
                        className={styles.button}
                        variant="contained"
                        color="primary"
                        onClick={() => this.setState({ showField: true })}
                    >
                        Import from Etro
                    </Button>
                }
                <CSSTransition
                    classNames={{ ...styles }}
                    in={this.state.showField}
                    onEnter={() => this.setState({ showButton: false })}
                    onExit={() => this.setState({ hasError: false })}
                    onExited={() => this.setState({ showButton: true })}
                    unmountOnExit
                    timeout={500}
                >
                    <TextField
                        id="etro"
                        variant="outlined"
                        color="primary"
                        size="small"
                        placeholder="https://etro.gg/gearset/..."
                        onChange={this.onChange}
                        error={this.state.hasError}
                    />
                </CSSTransition>
            </div>
            {this.state.hasError &&
                <Typography color="error" align="center">
                    * Not a valid etro.gg url.
                </Typography>
            }
        </Box>
    }
}
