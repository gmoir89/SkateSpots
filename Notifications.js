import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';

function Notifications({ savedPhotoUris, onDelete, onUpdate }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  // Function to render location if available
  const renderLocation = (location) => {
    if (location && location.coords) {
      return (
        <Text>
          Lat: {location.coords.latitude.toFixed(3)}, Lon: {location.coords.longitude.toFixed(3)}
        </Text>
      );
    }
    return <Text>No location data</Text>;
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setDescription(photo.description || '');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPhoto(null);
  };

  const handleUpdate = () => {
    onUpdate(selectedPhoto.fileUri, description);
    closeModal();
  };

  const handleDelete = () => {
    onDelete(selectedPhoto.fileUri);
    closeModal();
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Spots!</Text>
        {savedPhotoUris.map((photo, index) => {
          const { fileUri, location, description } = photo.fileUri ? photo : { fileUri: photo, description: '' };
          
          return (
            <TouchableOpacity key={fileUri} style={styles.imageContainer} onPress={() => openModal(photo)}>
              <Image source={{ uri: fileUri }} style={styles.image} />
              <Text>{description}</Text>
              {renderLocation(location)}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {selectedPhoto && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={{ uri: selectedPhoto.fileUri }} style={styles.modalImage} />
              {selectedPhoto.location && renderLocation(selectedPhoto.location)}
              <TextInput
                style={styles.modalText}
                onChangeText={setDescription}
                value={description}
                placeholder="Enter a description..."
              />
              <View style={styles.modalButtons}>
                <Button title="Update" onPress={handleUpdate} />
                <Button title="Delete" onPress={handleDelete} color="red" />
              </View>
              <Button title="Close" onPress={closeModal} />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    width: '80%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
});

export default Notifications;