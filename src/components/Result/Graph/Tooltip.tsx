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
            <strong>{ formatSeconds(slice.points[0].data.x) }</strong>
            <table style={{ ...tableStyle, ...theme.tooltip.table }}>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            {row.map((column, j) => (
                                <td key={j} style={theme.tooltip.tableCell }>
                                    {column}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}

export const SliceTooltip = memo(SliceTooltipComponent)
