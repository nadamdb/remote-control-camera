import pytest

def inc(x):
	return x + 1

def test_answer():
	assert inc(41) == 42
