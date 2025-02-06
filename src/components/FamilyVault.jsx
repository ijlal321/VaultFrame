"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, UserPlus, Heart } from "lucide-react"

function FamilyPictureVaultApp() {
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: "1",
      name: "Mom",
      pictures: ["/placeholder.svg?height=300&width=300", "/placeholder.svg?height=300&width=300"],
    },
    { id: "2", name: "Dad", pictures: ["/placeholder.svg?height=300&width=300"] },
    {
      id: "3",
      name: "Sister",
      pictures: [
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
        "/placeholder.svg?height=300&width=300",
      ],
    },
    { id: "4", name: "Brother", pictures: ["/placeholder.svg?height=300&width=300"] },
  ])

  const [newMemberName, setNewMemberName] = useState("")

  const addFamilyMember = () => {
    if (newMemberName.trim()) {
      setFamilyMembers([
        ...familyMembers,
        {
          id: Date.now().toString(),
          name: newMemberName.trim(),
          pictures: [],
        },
      ])
      setNewMemberName("")
    }
  }

  const uploadPicture = (memberId) => {
    // This is a placeholder function. In a real app, this would handle the actual file upload.
    console.log(`Uploading picture for member ${memberId}`)
    // For demonstration, we'll just add a placeholder image
    setFamilyMembers(
      familyMembers.map((member) =>
        member.id === memberId
          ? { ...member, pictures: [...member.pictures, "/placeholder.svg?height=300&width=300"] }
          : member,
      ),
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue={familyMembers[0].id} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 bg-blue-50 p-1 rounded-xl">
          {familyMembers.map((member) => (
            <TabsTrigger
              key={member.id}
              value={member.id}
              className="data-[state=active]:bg-white data-[state=active]:text-blue-800 rounded-lg transition-all"
            >
              {member.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {familyMembers.map((member) => (
          <TabsContent key={member.id} value={member.id}>
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-blue-800 text-white">
                <CardTitle className="text-2xl">{member.name}'s Album</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {member.pictures.map((pic, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={pic || "/placeholder.svg"}
                        alt={`${member.name}'s picture ${index + 1}`}
                        className="object-cover w-full h-full rounded-lg transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                        <Heart className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50">
                <Button onClick={() => uploadPicture(member.id)} className="w-full bg-blue-800 hover:bg-blue-700">
                  <Upload className="mr-2 h-4 w-4" /> Upload New Picture
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-green-800 text-white">
          <CardTitle className="text-2xl">Add New Family Member</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="newMember" className="text-gray-700">
                Name
              </Label>
              <Input
                type="text"
                id="newMember"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <Button onClick={addFamilyMember} className="mt-6 bg-green-800 hover:bg-green-700">
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FamilyPictureVaultApp

