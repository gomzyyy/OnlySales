import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Owner} from '../../../../../types';
import {BusinessType} from '../../../../../enums';
const NoPhoto = require('../../../../assets/images/no-profile.jpg');

interface OwnerCardProps {
  owner: Owner;
}

const OwnerCard: React.FC<OwnerCardProps> = ({owner}) => {
  const {
    name,
    image,
    businessName,
    businessType,
    businessDescription,
    email,
    location,
    reviews,
    businessPhoneNumber,
    address,
  } = owner;

  return (
    <View style={styles.card}>
        <Text style={styles.reviewText}>
            {reviews?.length || 0} Review{reviews?.length === 1 ? '' : 's'}
          </Text>
      <View style={styles.header}>
        <Image
          source={image && image.trim().length !== 0 ? {uri: image} : NoPhoto}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.businessName}>{businessName}</Text>
          <Text style={styles.businessType}>
            type:{' '}
            {businessType === BusinessType.OTHER
              ? businessDescription && businessDescription.trim().length !== 0
                ? businessDescription
                : 'NOT SPECIFIED'
              : businessType}
          </Text>
          {email?.value && (
            <Text style={styles.contactText}>
              {email.value} {email.verified && '✅'}
            </Text>
          )}
          <Text style={styles.contactText}>
            {'+91 '}
            {businessPhoneNumber.value}
          </Text>
          <Text style={styles.contactText}>{address}</Text>
          
        </View>
        
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonLight}>
          <Text style={styles.buttonTextDark}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDark}>
          <Text style={styles.buttonTextLight}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  businessName: {
    color: '#555',
    marginTop: 2,
  },
  businessType: {
    fontStyle: 'italic',
    color: '#777',
    marginTop: 2,
  },
  description: {
    color: '#444',
    marginTop: 8,
  },
  contactInfo: {
    marginTop: 10,
  },
  contactText: {
    color: '#555',
    marginTop: 2,
  },
  reviewText: {
    marginTop: 8,
    color: '#f39c12',
    fontWeight: '500',
    position:'absolute',
    top:10,
    right:10
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  buttonLight: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
  },
  buttonDark: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  buttonTextLight: {
    color: '#fff',
  },
  buttonTextDark: {
    color: '#333',
  },
});

export default OwnerCard;

{
  /* <View style={styles.header}>
        <Image
          source={{ uri: image || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.businessName}>{businessName}</Text>
          <Text style={styles.businessType}>{businessType}</Text>
        </View>
      </View>

      Description
      {businessDescription && (
        <Text style={styles.description} numberOfLines={3}>
          {businessDescription}
        </Text>
      )}

      <View style={styles.contactInfo}>
        {email?.value && (
          <Text style={styles.contactText}>
            📧 {email.value} {email.verified && '✅'}
          </Text>
        )}
          <Text style={styles.contactText}>
            📱 {businessPhoneNumber}
          </Text>
        <Text style={styles.contactText}>
          📍 {location?.city}, {location?.state}
        </Text>
      </View>

      <Text style={styles.reviewText}>
        ⭐ {reviews?.length || 0} Review{reviews?.length === 1 ? '' : 's'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonLight}>
          <Text style={styles.buttonTextDark}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonDark}>
          <Text style={styles.buttonTextLight}>Contact</Text>
        </TouchableOpacity>
      </View> */
}
