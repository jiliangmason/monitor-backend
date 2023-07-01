import ElasticSearch from '../es'
import config from '../config'

class RecordModel extends ElasticSearch {
    constructor() {
        super({
            index: config.es.index,
            alias: config.es.alias,
        })
        this._mappings = {
            mappings: {
                properties: {
                    id: { type: 'keyword' },
                    phone: { type: 'keyword' },
                    level: { type: 'keyword' },
                    message: { type: 'keyword' },
                    time: { type: 'date', format: 'yyyy-MM-dd HH:mm:ss' },
                    url: { type: 'keyword' },
                    create_time: { type: 'date', format: 'yyyy-MM-dd HH:mm:ss' },
                    extend1: { type: 'keyword' },
                    extend2: { type: 'keyword' },
                    extend3: { type: 'keyword' },
                    extend4: { type: 'long' },
                    extend5: { type: 'long' },
                    extend6: { type: 'text' },
                    extend7: { type: 'text' },
                    extend8: { type: 'text' },
                    extend9: { type: 'text' },
                    extend10: { type: 'text' }
                }
            }
        }
    }

    indices() {
        return super.indices(this._mappings)
    }

    async save(params) {
        await this.indices()
        return await super.save(params)
    }
}

export default RecordModel