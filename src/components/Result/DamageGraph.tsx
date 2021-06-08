import * as React from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Line } from '@nivo/line'
import { GearsetInfo } from './Result'

const firstColor = "hsl(220, 100%, 60%)"
const secondColor = "hsl(40, 100%, 60%)"

interface Point
{
    x: number
    y: number
}

export interface GraphData
{
    id: string | number
    data: Point[]
}

interface Props 
{
    gearsets: GearsetInfo[]
}

export class DamageGraph extends React.Component<Props>
{
    private data = this.props.gearsets
        .reduce((data: GraphData[], gearset) => data = [...data, gearset.data], [])
    
    private getColor = (line: GraphData) => {
        if (line.id === this.props.gearsets[0].name) {
            return firstColor
        }
        return secondColor
    }

    render() {
        return <AutoSizer disableHeight>
            {({ width }) => (
                <div style={{width: width + 'px'}}>
                    <Line
                        margin={{ top: 20, right: 10, bottom: 60, left: 60 }}
                        height={500}
                        width={width}
                        data={this.data}
                        animate={true}
                        isInteractive={true}
                        useMesh={true}
                        colors={this.getColor}
                        curve='basis'
                        enablePoints={false}
                        enableGridX={false}
                        enableGridY={false}
                        xScale={{type: 'linear'}}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: 5,
                            legend: 'DPS',
                            legendOffset: -50,
                            legendPosition: 'middle'
                        }}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 0,
                            tickPadding: 9,
                            tickRotation: 0,
                            tickValues: 10,
                            legend: '',
                            legendOffset: 0,
                            legendPosition: 'middle'
                        }}
                        legends={[{
                            anchor: "top-right",
                            direction: "column",
                            translateX: -20,
                            translateY: 0,
                            itemWidth: 80,
                            itemHeight: 25,
                            itemDirection: "right-to-left",
                            symbolSize: 12,
                            symbolShape: "circle",
                        }]}
                        theme={{
                            textColor: "#FFFFFF",
                            fontFamily: "Roboto",
                            axis: {
                                domain: {
                                    line: {
                                        stroke: "#FFFFFF",
                                        "strokeWidth": 1
                                    }
                                },
                                ticks: {
                                    line: {
                                        stroke: "#FFFFFF",
                                        strokeWidth: 1
                                    }
                                }
                            },
                            grid: {
                                line: {
                                    stroke: "#FFFFFF",
                                    strokeWidth: 1
                                }
                            },
                            tooltip: {
                                container: {
                                    color: "black",
                                }
                            }, 
                        }}
                    />
                </div>
        )}
        </AutoSizer>
    }
}
