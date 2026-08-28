# Final Firebase Data Structure

## authorizedUsers/{lowercase-email}
Parent:
```text
role: "parent"
```

Regional:
```text
role: "regional"
region: "North Region"
regionId: "north-region"
```

Client:
```text
role: "client"
clientproject: "Client / Project Name"
sector: "Sector Name"
region: "North Region"
regionId: "north-region"
```

## regionCatalog/{regionId}
```text
name: "North Region"
sectors: ["Sector A", "Sector B"]
locations: ["Regional Office / Location"]
```

## sectorCatalog/{sectorId}
```text
name: "Sector A"
region: "North Region"
regionId: "north-region"
```

## records/{recordId}
Every new employee must contain:
```text
region
regionId
sector
clientproject
name
...
photoUrl
policeVerificationUrl
```

## Storage
```text
enrollment/{recordId}/employee-photo.<ext>
enrollment/{recordId}/police-verification.<ext>
```

Storage access is tied to the Firestore record's RBAC scope.
