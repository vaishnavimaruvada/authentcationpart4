import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import ProductCard from '../ProductCard'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'Success',
  failure: 'Failure',
  inProgress: 'Inprogress',
}

class PrimeDealsSection extends Component {
  state = {
    primeDeals: [],
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getPrimeDeals()
  }

  getPrimeDeals = async () => {
    this.setState({inProgress: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.prime_deals.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        primeDeals: updatedData,
        apiStatus: apiConstants.success,
      })
    } else if (response.status === 401) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderPrimeDealsList = () => {
    const {primeDeals} = this.state
    return (
      <div className="products-list-container">
        <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
        <ul className="products-list">
          {primeDeals.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderPrimeDealsFailureView = () => (
    <img
      src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
      alt="Register Prime"
      className="register-prime-image"
    />
  )

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderPrimeDealsList()
      case apiConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiConstants.inPogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default PrimeDealsSection
