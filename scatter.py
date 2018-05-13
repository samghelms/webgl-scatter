"""Scatter interface for python."""

from websocket_server import WebsocketServer
from threading import Thread
from helpers import find_free_port
import json
from uuid import uuid1
# TODO: make this import conditional
from IPython.display import (display_javascript, display_html)


class Scatter:
    """Interface for python."""

    def __init__(self, x, y, labels, label_formatter=None):
        """Initialize the plot.

        Parameters
        ----------
        x : list of floats
            x coordinates of each point you want to plot.
        y : list of floats
            y coordinates of each point you want to plot.
        labels : type
            'label' corresponding with the x and y coordinates.
            Could be anything from the text of a word corresponding
            with a word embedding to the id/path of an image url that
            you want to call with your label formatter.

        Returns
        -------
        Scatter
            Scatter object constructor.

        """
        # size of chunks to send to the visualization
        # Start out with smaller chunks, progressively send larger chunks
        self.CHUNK_SIZE = 500000
        self.PORT = 54286 #find_free_port()
        self.server = WebsocketServer(self.PORT)
        print(self.PORT)
        # todo: validate that the length of all passed lists are the same
        assert len(x) == len(y) == len(labels)

        def new_client(client, server):
            print("New client connected and was given id %d" % client['id'])
            # Check if we need to load the library
            self.server.send_message(client, {'loaded_scatter'})
            n = len(x)
            for i in range(n):
                if (i > 0 and i % self.CHUNK_SIZE == 0) or i == n - 1:
                    start_idx = max(0, i-self.CHUNK_SIZE)
                    x_chunk = x[start_idx:i + 1]
                    y_chunk = y[start_idx:i + 1]
                    label_chunk = labels[start_idx:i + 1]
                    self.server.send_message(client,
                                             json.dumps({'x': x_chunk,
                                                         'y': y_chunk,
                                                         'labels': label_chunk
                                                         }))
            # self.server.send_message_to_all("Finished")

        self.server.set_fn_new_client(new_client)

        # Called for every client disconnecting
        def client_left(client, server):
            print("Client(%d) disconnected" % client['id'])

        self.server.set_fn_client_left(client_left)

        # Called when a client sends a message
        def message_received(client, server, message):
            self.dispatcher(json.loads(message))

        self.server.set_fn_message_received(message_received)

        def begin():
            self.server.run_forever()

        self.server_thread = Thread(target=begin)
        self.server_thread.start()

        self._ids = []

    def dispatcher(self, message):
        if message['command'] == 'request_data':
            pass
        elif message['command'] == 'load_lib':
            pass


    def _repr_html_(self):
        unique_id = str(uuid1())
        anchor = '<div id="{unique_id}"/>'.format(unique_id=unique_id)
        self._ids.append(unique_id)
        return anchor

    def _create_js(self, uid):
        script = open('scatter-script.js').read()
        script = script.replace('_UID_', uid)
        return script

    def _repr_javascript_(self):
        js = []
        while len(self._ids) > 0:
            i = self._ids.pop(0)
            # funcs = 'console.log("' + 'test' + '");'#self._filled_ctx(i, self._s)
            funcs = self._create_js(i)
            js.append(funcs)
        print("\n".join(js))
        return "\n".join(js)

    def _ipython_display_(self):
        display_html(self._repr_html_(), raw=True)
        display_javascript(self._repr_javascript_(), raw=True)

    def to_html(self, out_path):
        """Write an html file with the visualization.

        You can open this in the browser
        """
        with open(out_path) as out:
            raise NotImplemented
            out.write("NOT IMPL")
