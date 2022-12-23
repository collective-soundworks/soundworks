export default StateManager;
/**
 * Component dedicated at managing distributed states (i.e.{@link common.SharedState}
 * instances) among the application.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Client`
 * at initialization (cf. {@link client.Client#stateManager}).
 *
 * Tutorial: [https://collective-soundworks.github.io/tutorials/state-manager.html](https://collective-soundworks.github.io/tutorials/state-manager.html)
 *
 * @memberof client
 * @extends BaseStateManager
 * @inheritdoc
 * @see {@link common.SharedState}
 * @see {@link client.Client#stateManager}
 */
declare class StateManager extends BaseStateManager {
}
import BaseStateManager from "../common/BaseStateManager.js";
//# sourceMappingURL=StateManager.d.ts.map