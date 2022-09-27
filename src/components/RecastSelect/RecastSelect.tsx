import { InputBaseComponentProps, TextField, Typography } from '@material-ui/core'
import React from 'react'
import styles from './RecastSelect.module.css'

const BASE_RECAST = 2500
const MIN_RECAST = 1500

interface Props {
    recast: number
    onChange: (validRecast: boolean, recast: number) => void
    inputProps?: InputBaseComponentProps
}

export function RecastSelect(props: Props): JSX.Element {
    const [validRecast, setValidRecast] = React.useState(true)

    const onRecastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const recast = parseFloat(event.target.value) * 1000
        const valid = recast >= MIN_RECAST && recast <= BASE_RECAST

        setValidRecast(valid)
        props.onChange(valid, recast)
    }

    return <div className={styles.outer}>
        <TextField
            autoFocus
            id="gcd"
            variant="outlined"
            color="primary"
            size="small"
            defaultValue={(props.recast / 1000).toFixed(2)}
            inputProps={props.inputProps}
            error={!validRecast}
            onChange={onRecastChange}
        />
        {!validRecast &&
            <Typography color="error" align="center">
                    * A valid recast must be between 1.50s and 2.50s.
            </Typography>
        }
    </div>
}
