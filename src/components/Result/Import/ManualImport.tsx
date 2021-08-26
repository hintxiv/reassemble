import { Button } from '@material-ui/core'
import React from 'react'
import styles from './Import.module.css'

interface Props {
    addGearset: () => Promise<void>
}

export class ManualImport extends React.Component<Props, {}> {

    render() {
        return <div className={styles.import}>
            <Button
                className={styles.button}
                variant="contained"
                color="secondary"
                onClick={this.props.addGearset}
            >
                Add Gearset
            </Button>
        </div>
    }
}
