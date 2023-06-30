import eslasticsearch from '@elastic/elasticsearch'
import { clone } from 'lodash'
import config from '../config'

class ElasticSearch {
    constructor(opts) {
        this.index = opts && opts.index ? opts.index : 'ELS_INDEX'
        this.alias = opts && opts.alias ? opts.alias : 'ELS_ALIAS'
        this._searchIndex = this.alias ? this.alias : this.index
        this.client = new eslasticsearch.Client(clone(config.es))
    }

    async ping() {
        try {
            return await this.client.ping()
        } catch(err) {
            throw err
        }
    }

    async indices(params) {
        const { settings, mappings } = params
        try {
            const exists = await this.client.indices.exists({ index: this.index })
            if (!exists) {
                const settingBody = settings ? settings : 
                    {
                        number_of_shards: 3,
                        number_of_replicas: 1
                    }
                // create
                await this.client.indices.create({ index: this.index, settings: settingBody })
                // mapping
                await this.client.indices.putMapping({ index: this.index,  ...mappings })
                // alias
                if (this.alias) {
                    await this.client.indices.putAlias({ index: this.index, name: this.alias })
                }
            }
            return true
        } catch(err) {
            throw err
        }
    }

    async update(params) {
        const { id } = params
        try {
            return await this.client.update({ index: this.index, id, doc: params })
        } catch(err) {
            throw err
        }
    }

    async save(params) {
        const { id } = params
        try {
            const exists = await this.client.exists({ index: this.index, id })
            if (!exists) {
                return await this.client.index({ index: this.index, id, document: params })
            }
            return await this.update(params)
        } catch(err) {
            throw err
        }
    }

    async search(params) {
        try {
            return await this.client.search({
                index: this._searchIndex,
                ...params,
            })
        } catch(err) {
            if (err.message === 'Not Found') return {};
            throw err
        }
    }

    async get(params) {
        try {
            return await this.client.get({
                index: this._searchIndex,
                ...params,
            })
        } catch(err) {
            if (err.message === 'Not Found') return {};
            throw err;
        }
    }

    /**
     * 
     * @param {*} params
     * scroll_id:  表示上一个 scroll 查询返回的 _scroll_id 值，用于获取下一批的数据。
     * scroll: 指定了 scroll 上下文的保持时间。该参数的值应该包含时间单位（如 "1m" 表示 1 分钟）。
     * @returns 
     */
    async scroll(params) {
        try {
            return await this.client.scroll(params)
        } catch(err) {
            throw err;
        }
    }
    
}

export default ElasticSearch

