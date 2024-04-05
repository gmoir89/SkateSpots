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
} from 'react-native';

function Notifications({ savedPhotoUris, onDelete, onUpdate }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  const renderLocation = (location) => {
    if (location && location.coords) {
      return (
        <Text style={{ color: 'black' }}>Lat: {location.coords.latitude.toFixed(3)}, Lon: {location.coords.longitude.toFixed(3)}</Text>
      );
    }
    return <Text style={{ color: 'black' }}>No location data</Text>;
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
        <Text style={{ color: 'black', fontSize: 22, marginBottom: 10 }}>Spots!</Text>
        {savedPhotoUris.map((photo, index) => {
          const { fileUri, location, description } = photo.fileUri ? photo : { fileUri: photo, description: '' };

          return (
            <TouchableOpacity key={fileUri} style={styles.imageContainer} onPress={() => openModal(photo)}>
              <Image source={{ uri: fileUri }} style={styles.image} />
              <Text style={{ color: 'black' }}>{description}</Text>
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
                placeholderTextColor="#bbb"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDelete}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
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
    backgroundColor: '#FFFFFF', // Reverted to original background color
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10, // Rounded corners for images
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // Adds a semi-transparent overlay
  },
  modalView: {
    margin: 20,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    backgroundColor: "#222",
    color: 'white',
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#666",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Notifications;