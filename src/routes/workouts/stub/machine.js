import { createMachine, interpret } from 'xstate';

export function createService(context, options = {}) {
	const settings = {
		predictableActionArguments: true,
		preserveActionOrder: true,
		strict: true
	};
	const machine = createMachine({ ...definition, ...settings }, options); //.withContext(context);
	return interpret(machine).onTransition((state, event) =>
		console.log(event?.type, 'transition', state, event)
	);
	//.onEvent(event => console.log('event', event));
}

/* https://stately.ai/registry/editor/1d5c8e42-5473-4fb2-be56-322c38f2e928?machineId=034ba55a-3708-4400-84a4-74d7cbc24db8 */
const definition = {
	id: 'Table Editor',
	context: {
		activeRow: 'null',
		model: 'null',
		cachedModel: 'null'
	},
	initial: 'IDLE',
	states: {
		IDLE: {
			on: {
				focus: {
					target: 'FOCUSED',
					actions: 'setActiveRow'
				},
				add: {
					target: 'FOCUSED',
					actions: 'add'
				},
				remove: {
					actions: 'remove'
				},
				copy: {
					target: 'FOCUSED',
					actions: 'copy'
				},
				clear: {
					actions: 'clear'
				}
			}
		},
		FOCUSED: {
			entry: 'renderFocus',
			initial: 'VIEWING',
			states: {
				VIEWING: {
					on: {
						edit: {
							target: 'EDITING',
							actions: 'beginTransaction'
						},
						blur: {
							target: '#Table Editor.IDLE',
							actions: 'unsetActiveRow'
						}
					}
				},
				EDITING: {
					states: {
						CHANGING: {
							initial: 'CLEAN',
							states: {
								CLEAN: {
									on: {
										change: {
											target: 'DIRTY'
										}
									}
								},
								DIRTY: {
									on: {
										change: {}
									}
								}
							}
						},
						VALIDATING: {
							initial: 'INDETERMINATE',
							states: {
								INDETERMINATE: {
									on: {
										validate: [
											{
												target: 'VALID',
												cond: 'isValid'
											},
											{
												target: 'INVALID'
											}
										]
									}
								},
								INVALID: {
									on: {
										validate: [
											{
												target: 'VALID',
												cond: 'isValid'
											},
											{}
										]
									}
								},
								VALID: {
									on: {
										validate: [
											{
												cond: 'isValid'
											},
											{
												target: 'INVALID'
											}
										]
									}
								}
							},
							on: {
								change: [
									{
										target: '.VALID',
										cond: 'isValid'
									},
									{
										target: '.INVALID'
									}
								]
							}
						},
						MOVING: {
							initial: 'IDLE',
							states: {
								ACTIVE: {
									on: {
										move: [
											{
												target: 'PROPOSING',
												cond: 'isEligible'
											},
											{}
										]
									}
								},
								PROPOSING: {
									entry: 'move',
									on: {
										move: {
											target: 'ACTIVE'
										}
									}
								},
								IDLE: {
									on: {
										start: {
											target: 'ACTIVE'
										}
									}
								}
							}
						},
						_history: {
							history: 'deep',
							type: 'history'
						}
					},
					on: {
						cancel: [
							{
								target: 'VIEWING',
								cond: 'isClean',
								actions: 'rollback'
							},
							{
								target: 'CONFIRMING'
							}
						],
						done: [
							{
								target: '#Table Editor.FOCUSED',
								cond: 'isDone',
								actions: 'commit',
								description: 'Check valid state and dirtiness'
							},
							{
								target: 'VIEWING'
							}
						]
					},
					type: 'parallel'
				},
				CONFIRMING: {
					on: {
						yes: {
							target: 'VIEWING',
							actions: 'rollback'
						},
						no: {
							target: '#Table Editor.FOCUSED.EDITING._history'
						}
					}
				}
			}
		}
	}
};
