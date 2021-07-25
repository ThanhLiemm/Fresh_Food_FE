import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import './banner.scss'
import {get} from '../../httpHelper'

export default class Banner extends Component {
    render() {
        return (
            <div className="banner">
                <Container>
                    <div>{this.props.name}</div>
                </Container>
            </div>
        )
    }
}
