Federated learning is a decentralized approach to training machine learning models. Each client has a local training dataset which is never uploaded to the server. Instead, each client computes an update to the current global model maintained by the server, and only this update is communicated. This is a direct application of the principle of focused collection or data minimization.

AI models require massive volumes of data. These datasets are typically centralized in a single location for model training, opening up opportunities for any personally identifiable information (PII)] (contained in the datasets to be exposed during transmission or storage.

Federated learning helps address these concerns as sensitive information remains on the node, preserving data privacy. It also allows for collaborative learning, with varied devices or servers contributing to the refinement of AI models.

The main difference between federated learning and distributed learning lies in the assumptions made on the properties of the local datasets, as distributed learning originally aims at parallelizing computing power where federated learning originally aims at training on heterogeneous datasets. While distributed learning also aims at training a single model on multiple servers, a common underlying assumption is that the local datasets are independent and identically distributed(IID) and roughly have the same size. None of these hypotheses are made for federated learning; instead, the datasets are typically heterogeneous, and their sizes may span several orders of magnitude. Moreover, the clients involved in federated learning may be unreliable as they are subject to more failures or drop out since they commonly rely on less powerful communication media (i.e. Wi-Fi) and battery-powered systems (i.e. phones and IoT devices) compared to distributed learning where nodes are typically datacenters that have powerful computational capabilities and are connected to one another with fast networks

Federated learning is used when there are these scenarios
1. Training on real-world data from mobile devices provides a distinct advantage over training on proxy data that is generally available in the data center. 
2. This data is privacy sensitive or large in size (compared to the size of the model), so it is preferable not to log it to the data center purely for the purpose of model training (in service of the focused collection principle). 
3. For supervised tasks, labels on the data can be inferred naturally from user interaction.
   
Many models that power intelligent behavior on mobile devices fit the above criteria. As two examples, we consider image classification, for example predicting which photos are most likely to be viewed multiple times in the future, or shared; and language models, which can be used to improve voice recognition and text entry on touch-screen keyboards by improving decoding, next-word-prediction, and even predicting whole replies [10]. The potential training data for both these tasks (all the photos a user takes and everything they type on their mobile keyboard, including
passwords, URLs, messages, etc.) can be privacy sensitive. The distributions from which these examples are drawn are also likely to differ substantially from easily available proxy datasets: the use of language in chat and text messages is generally much different than standard language corpora, e.g., Wikipedia and other web documents; the photos people take on their phone are likely quite different than typical Flickr photos. And finally, the labels for these problems are
directly available: entered text is self-labeled for learning a language model, and photo labels can be defined by natural user interaction with their photo app (which photos are deleted, shared, or viewed).

## Mathematical Formulation





## Stages in Federated learning

