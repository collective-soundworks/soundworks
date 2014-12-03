module.exports = {
 ioServer: require('./ioServer'),
 ConnectionManager: require('./ServerConnectionManager'),
 PerformanceManager: require('./ServerPerformanceManager'),
 PlacementManager: require('./ServerPlacementManager'),
 PlacementManagerAssignedPlaces: require('./ServerPlacementManagerAssignedPlaces'),
 Player: require('./ServerPlayer'),
 PlayerManager: require('./ServerPlayerManager'),
 SetupManager: require('./ServerSetupManager'),
 SetupManagerPlacementAndSync: require('./ServerSetupManagerPlacementAndSync'),
 SoloistManager: require('./ServerSoloistManager'),
 SoloistManagerRandomUrn: require('./ServerSoloistManagerRandomUrn'),
 SyncManager: require('./ServerSyncManager'),
 TopologyManager: require('./ServerTopologyManager'),
 TopologyManagerRegularMatrix: require('./ServerTopologyManagerRegularMatrix')
};