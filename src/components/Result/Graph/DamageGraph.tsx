import { Typography } from '@material-ui/core'
import { Line, SliceTooltipProps } from '@nivo/line'
import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { formatSeconds } from '../../../utilities/format'
import { GearsetInfo } from '../Result'
import { SliceTooltip } from './Tooltip'

const SECONDS_PER_MINUTE = 60

interface Point {
    x: number
    y: number
}

export interface GraphData {
    id: string | number
    data: Point[]
}

interface Props {
    gearsets: GearsetInfo[]
}

export class DamageGraph extends React.Component<Props> {

    private getData = () => {
        return this.props.gearsets
            .reduce((data: GraphData[], gearset) => data = [...data, gearset.data], [])
            .reverse()
    }

    private getTooltip = ({ slice }: SliceTooltipProps) => {
        return <SliceTooltip axis="x" slice={slice} />
    }

    private getMinuteTicks(): number[] {
        const ticks = [0]
        const data = this.props.gearsets[0].data.data

        let end = data[data.length - 1].x.valueOf()

        while (end > SECONDS_PER_MINUTE) {
            end -= SECONDS_PER_MINUTE
            ticks.push(ticks[ticks.length - 1] + SECONDS_PER_MINUTE)
        }

        return ticks
    }

    render() {
        if (this.props.gearsets.length === 0) {
            return <div>
                <Typography align="center">
                    Add a gearset to see DPS results.
                </Typography>
            </div>
        }

        return <AutoSizer disableHeight>
            {({ width }) => (
                <div style={{ width: width + 'px' }}>
                    <Line
                        margin={{ top: 20, right: 20, bottom: 60, left: 70 }}
                        height={500}
                        width={width}
                        data={this.getData()}
                        animate={true}
                        isInteractive={true}
                        useMesh={true}
                        curve="basis"
                        enablePoints={false}
                        enableGridX={false}
                        enableGridY={false}
                        colors={{ scheme: 'category10' }}
                        xScale={{ type: 'linear' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: 5,
                            legend: 'DPS',
                            legendOffset: -60,
                            legendPosition: 'middle',
                        }}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: this.getMinuteTicks(),
                            legend: 'Fight Length',
                            legendOffset: 40,
                            legendPosition: 'middle',
                            // Convert seconds to mm:ss
                            format: formatSeconds,
                        }}
                        legends={[{
                            anchor: 'top-right',
                            direction: 'column',
                            translateX: -20,
                            translateY: 0,
                            itemWidth: 80,
                            itemHeight: 20,
                            itemDirection: 'right-to-left',
                            symbolSize: 12,
                            symbolShape: 'circle',
                        }]}
                        enableSlices="x"
                        sliceTooltip={this.getTooltip}
                        theme={{
                            textColor: '#FFFFFF',
                            fontFamily: 'Nunito',
                            fontSize: 14,
                            axis: {
                                domain: {
                                    line: {
                                        stroke: '#FFFFFF',
                                        'strokeWidth': 2,
                                    },
                                },
                            },
                            grid: {
                                line: {
                                    stroke: '#FFFFFF',
                                    strokeWidth: 1,
                                },
                            },
                            tooltip: {
                                container: {
                                    color: 'black',
                                },
                            },
                        }}
                    />
                </div>
            )}
        </AutoSizer>
    }
}
