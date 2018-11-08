import React from 'react';

import classNames from 'classnames/bind';
import styles from 'css/components/output';

const cx = classNames.bind(styles);

class Output extends React.Component {
  render() {
    const {
      clusterRequirements,
      clusterJson
    } = this.props;

    let output;
    if (clusterJson && !clusterJson.instance) {
      output = (
        <div>No cluster was found that meets the requirements</div>
      );
    } else if (clusterJson) {
      output = (
        <div>
          <h3>Cluster requirements</h3>
          <div className={cx('table')}>
            <div className={cx('leftColumn')}>
              <div>Required vCPUs</div>
              <div>Required memory</div>
              <div>Required storage</div>
            </div>
            <div className={cx('rightColumn')}>
              <div>{clusterRequirements.cpu}</div>
              <div>{clusterRequirements.memory} GB</div>
              <div>{clusterRequirements.storage} GB</div>
            </div>
          </div>
          <h3>Cluster information</h3>
          <div className={cx('table')}>
            <div className={cx('leftColumn')}>
              <div>API Name</div>
              <div>Availability zone</div>
              <div>Operating system</div>
              <div>Number of machines</div>
              <div>Total vCPUs</div>
              <div>Total memory</div>
              <div>Total storage</div>
              <div>Total price</div>
            </div>
            <div className={cx('rightColumn')}>
              <div>{clusterJson.instance.apiName}</div>
              <div>{clusterJson.availabilityZone}</div>
              <div>{clusterJson.operatingSystem}</div>
              <div>{clusterJson.numMachines}</div>
              <div>{clusterJson.totalvCpus}</div>
              <div>{clusterJson.totalMemory} GB</div>
              <div>{clusterJson.totalStorage} GB</div>
              <div>${clusterJson.totalPrice}</div>
            </div>
          </div>

          <h3>Instance information</h3>
          <div className={cx('table')}>
            <div className={cx('leftColumn')}>
              <div>API Name</div>
              <div>vCPUs</div>
              <div>Memory</div>
              <div>Storage</div>
            </div>
            <div className={cx('rightColumn')}>
              <div>{clusterJson.instance.apiName}</div>
              <div>{clusterJson.instance.vCpus}</div>
              <div>{clusterJson.instance.memory} GB</div>
              <div>{clusterJson.instance.storage} GB</div>
            </div>
          </div>
        </div>
      );
    } else {
      output = <div>Not yet calculated</div>;
    }

    return (
      <div>
        <h2>Optimal cluster</h2>
        {output}
      </div>
    );
  }
}

Output.propTypes = {
  clusterRequirements: React.PropTypes.object,
  clusterJson: React.PropTypes.object
};

export default Output;
