import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import * as topojsonClient from 'topojson-client'

const data = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
// const data = './countries-110m.json'

const width = window.innerWidth
const height = window.innerHeight

const t = d3.transition()
    .duration(750)
    .ease(d3.easeExpOut);

const projection = d3.geoMercator().scale(190).translate([ width / 2, height / 1.43 ])
const geopathGenerator = d3.geoPath().projection(projection)
    
export const D3Map = () => {
  const [animationState, setAnimationState] = useState({
    start: [-94, 40], // contoh koordinat awal
    end: [10, 15],   // contoh koordinat akhir
  })
  
  const [geographies, setGeographies] = useState([])
  const markersRef = useRef(null)
  
  useEffect(() => {
    const { start, end } = animationState;
    const markers = d3.select(markersRef.current)
    
    const startPoint = projection(start);
    const endPoint = projection(end);

    d3.json(data).then((res: any) => {
      const geojson: any = topojsonClient.feature(res, res.objects.countries)
      setGeographies(geojson.features)
    })

    markers.append('line')
      .attr('x1', startPoint[0])
      .attr('y1', startPoint[1])
      .attr('x2', endPoint[0])
      .attr('y2', endPoint[1])
      .attr('stroke', 'red')
      .attr('stroke-width', 2);

    markers.transition(t).attr('stroke', 'blue')
  }, [animationState])

  return (
    <svg width="100%" height="100vh" className='bg-slate-900'>
      <g className='countries'>
        {
          geographies.map((d,i) => {
            return (
              <path
                // onClick={() => alert(d.properties.name)}
                key={`path-${i}`}
                d={geopathGenerator(d)!}
                className="fill-slate-800 hover:fill-slate-700"
                strokeWidth={ 0.5 }
              />
            )
          })
        }
      </g>
      <g className='markers' ref={markersRef}>
        
      </g>
    </svg>
  )
}