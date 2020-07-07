import React from 'react';
import './App.css';
import Product from './Product';
import * as contentful from 'contentful-management';

export const client = contentful.createClient({
    accessToken: process.env.REACT_APP_ACCESS_TOKEN_MANAGEMENT
})

class ProductList extends React.Component {

    state = {
        products: []
    }

    componentDidMount() {
        client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then((space) => space.getEntries())
        .then((response) => {
            this.setState({
                products: response.items
            })
            console.log(this.state.products)
        })
        .catch(console.error)
    }

    handleInput = (e, i) => {
        console.log(e.target, i)
        let products = [...this.state.products]
        let product = {...products[i]}
        product.fields.name['en-US'] = e.target.value
        this.setState({products})
        console.log(this.state.products)

        // Update entry
        client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then((space) => space.getEntry(product.sys.id))
        .then((entry) => {
        entry.fields.name['en-US'] = this.state.products[i].fields.name['en-US']
        return entry.update()
        })
        .then(() => console.log('Entry updated.'))
        .catch(console.error)
    }

    toggleChange = (i) => {
        let products = [...this.state.products]
        let product = {...products[i]}
        product.fields.isChecked['en-US'] = !product.fields.isChecked['en-US']
        this.setState({products})
        console.log(this.state.products)
        
        // Update entry to Contenful
        client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then((space) => space.getEntry(product.sys.id))
        .then((entry) => {
        entry.fields.isChecked['en-US'] = this.state.products[i].fields.isChecked['en-US']
        return entry.update()
        })
        .then((entry) => console.log('Entry updated.'))
        .catch(console.error)
    }

    removeItem = (productId) => {
        const products = this.state.products.filter(product => product.sys.id !== productId)
        this.setState({products})
        console.log(this.state.products)

        client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then((space) => space.getEntry(productId))
        .then((entry) => {
            entry.unpublish()
            console.log('Entry unpublished.')
            client.getSpace(process.env.REACT_APP_SPACE_ID)
            .then((space) => space.getEntry(productId))
            .then((entry) => entry.delete())
            .then(() => console.log('Entry deleted.'))
            .catch(console.error)
        })
        .catch(console.error)
    }

    addChildren = () => {
        let products = [...this.state.products]
        console.log(this.state.products)

        client.getSpace(process.env.REACT_APP_SPACE_ID)
        .then((space) => space.createEntry('shoppingList', {
        fields: {
            name: {
                'en-US': ''
            },
            isChecked: {
                'en-US': false
            }
        }
        }))
        .then((entry) => {
            products.unshift(entry)
            this.setState({products: products})
        })
        .catch(console.error)

    }

    render() {
        return (
            <ul className="product-list">
                {
                this.state.products.map((product, index) => 
                    <Product 
                        product={product} 
                        key={index} 
                        index={index}
                        id={product.sys.id} 
                        handleToggle={this.toggleChange} 
                        handleValue={this.handleInput} 
                        handleDelete={this.removeItem} 
                    />
                )
                }
                <button className="button" onClick={this.addChildren}><i>+</i><p>Add item</p></button>
            </ul>
        );
    }
}

export default ProductList;