import React from 'react';

import InstanceCache from 'components/InstanceCache';
import Form from 'components/Form';
import Output from 'components/Output';

import classNames from 'classnames/bind';
import styles from 'css/components/home';

const cx = classNames.bind(styles);

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clusterRequirements: null,
      clusterJson: null
    };

    this.onCalculationSuccess = this.onCalculationSuccess.bind(this);
  }

  onCalculationSuccess(clusterRequirements, clusterJson) {
    this.setState({ clusterRequirements, clusterJson });
  }

  render() {
    return (
      <div className={cx('home')}>
        <h1 className={cx('home__header')}>Calculate optimal cluster on Amazon EC2</h1>
        <InstanceCache />
        <Form onSuccess={this.onCalculationSuccess} />
        <Output clusterRequirements={this.state.clusterRequirements} clusterJson={this.state.clusterJson} />
      </div>
    );
  }
}

export default Home;
