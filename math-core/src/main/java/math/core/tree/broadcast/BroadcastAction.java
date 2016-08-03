package math.core.tree.broadcast;

import java.util.function.Function;


import math.core.tree.MathNode;
import math.core.tree.OperandNode;
import math.core.tree.OperationNode;

public class BroadcastAction<R> {
	R result;
	OperandAction<R> operandAction;
	OperationAction<R> operationAction;

	public BroadcastAction(BroadcastType broadcastType){
		setBroadcastType(broadcastType);
	}
	public BroadcastAction() {
		setBroadcastType(BroadcastType.CUSTOM);
	}

	public void setResult(R result){
		this.result = result;
	}

	public R getResult(){
		return result;
	}

	public Function<OperandNode, R> getOperandAction(){
		return operandAction;
	}

	public Function<OperationNode, R> getOperationAction(){
		return operationAction;
	}

	public R runOn(MathNode<?> node,  boolean setResult){
		if(node instanceof OperandNode)
			if(setResult)
				setResult(operandAction.apply((OperandNode<?>)node));
			else
				operandAction.apply((OperandNode<?>)node);
		else
			if(setResult)
				setResult(operationAction.apply((OperationNode<?>)node));			
			else
				operationAction.apply((OperationNode<?>)node);				
			
		return getResult();
	}

	public void setBroadcastType(BroadcastType broadcastType){
		switch (broadcastType) {
			case CUSTOM:
				break;
			case OPERANDS:

				setOperationAction(operationNode ->{
					runOn(operationNode.getLeftNode(), false);
					runOn(operationNode.getRightNode(), false);
					return getResult();
				});
				break;
			case OPERATIONS:
				setOperandAction(operandNode -> {
					return null;
				});
				break;
			}
		}

	public R runOn(MathNode<?> node){
		return runOn(node, true);
	}

	public void setOperandAction(OperandAction<R> operandAction){
		this.operandAction = operandAction;
	}

	public void setOperationAction(OperationAction<R> operationAction){
		this.operationAction = operationAction;
	}




}