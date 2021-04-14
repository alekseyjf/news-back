class BaseModel {
  constructor(cluster) {
    this.cluster = cluster;

    this.setCluster = this.setCluster.bind(this);
  }

  setCluster(cluster) {
    console.log('cluster', cluster);
    this.cluster = cluster;
  }
}

module.exports = BaseModel;