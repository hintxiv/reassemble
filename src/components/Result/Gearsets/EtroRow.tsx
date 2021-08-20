import { Button, TextField } from '@material-ui/core'
import * as React from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './EtroRow.module.css'

interface Props {
    loadGearset: (gearsetID: string) => Promise<void>
}

interface State {
    showButton: boolean
    showField: boolean
}

export class EtroRow extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            showButton: true,
            showField: false,
        }
    }

    private onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const etroLinkPattern = /(?<=gearset\/)(.*)/i

        try {
            const url = new URL(event.target.value)
            const gearsetID = url.pathname.match(etroLinkPattern)[0]
            await this.props.loadGearset(gearsetID)

            this.setState({ showField: false })

        } catch (e) {
            // TODO "bad link lol"
            return
        }
    }

    render() {

        return <div style={{ display: 'flex', justifyContent: 'center' }}>
            {this.state.showButton && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.setState({ showField: true })}
                    style={{ width: '15%' }}
                >
                    Import from Etro
                </Button>
            )}
            <CSSTransition
                classNames={{ ...styles }}
                in={this.state.showField}
                onEnter={() => this.setState({ showButton: false })}
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
                />
            </CSSTransition>
        </div>
    }
}
