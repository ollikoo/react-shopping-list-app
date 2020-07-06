import React from 'react';
import './App.css';

class Product extends React.Component {

    render() {
        return (
            <li className="product">
                <input type="checkbox" defaultChecked={this.props.product.fields.isChecked['en-US']} onChange={(e) => this.props.handleToggle(this.props.index)} />
                <input type="text" value={this.props.product.fields.name['en-US']} onChange={(e) => this.props.handleValue(e, this.props.index)}/>
                
            </li>
        )
    }
}

export default Product;