import { Typography } from '@material-ui/core'
import { useTheme } from '@nivo/core'
import { SliceTooltipProps } from '@nivo/line'
import * as PropTypes from 'prop-types'
import React, { CSSProperties, memo } from 'react'
import { formatDamage, formatSeconds } from '../format'

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse' as CSSProperties['borderCollapse'],
}

const Chip = ({ color }: {key: React.Key, color: string}) => (
    <span style={{ display: 'block', borderRadius: '50%', width: '12px', height: '12px', background: color }} />
)

Chip.propTypes = {
    color: PropTypes.string.isRequired,
}

const SliceTooltipComponent = ({ slice }: SliceTooltipProps) => {
    const theme = useTheme()

    const rows = slice.points
        .sort((a, b) => (b.data.y as number) - (a.data.y as number)) // just trust me
        .filter((point, i) => slice.points.findIndex(other => point.serieId === other.serieId) === i)
        .map(point => [
            <Chip key="chip" color={point.serieColor} />,
            point.serieId,
            <strong key="value">{formatDamage(point.data.y)}</strong>,
        ])

    return <div style={theme.tooltip.container}>
        <div>
            <Typography variant="h6" align="center">{ formatSeconds(slice.points[0].data.x) }</Typography>
            <table style={{ ...tableStyle, ...theme.tooltip.table }}>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <td key={`chip-${i}`} style={theme.tooltip.tableCell }>
                                {row[0]}
                            </td>
                            <td key={`gearset-${i}`} style={theme.tooltip.tableCell }>
                                <Typography variant="subtitle2" align="left">{row[1]}</Typography>
                            </td>
                            <td key={`dps-${i}`} style={theme.tooltip.tableCell }>
                                <Typography variant="body1" align="right">{row[2]}</Typography>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}

export const SliceTooltip = memo(SliceTooltipComponent)
