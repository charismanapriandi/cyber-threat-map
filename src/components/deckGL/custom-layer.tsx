import { Model } from '@luma.gl/engine'
import { Layer, LayerContext } from 'deck.gl/typed'

export class ConnectionLayer extends Layer {
  initializeState(context: LayerContext): void {
    const { gl } = context
    
    console.log(this)
  }

  getModels(): Model[] {
    return []
  }
}