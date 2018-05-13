"""Helpers for the python interface."""
import socket


# https://stackoverflow.com/questions/2838244/get-open-tcp-port-in-python
def find_free_port():
    s = socket.socket()
    s.bind(('', 0))            # Bind to a free port provided by the host.
    return s.getsockname()[1]  # Return the port number assigned.