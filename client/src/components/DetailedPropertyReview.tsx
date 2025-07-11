import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  StarIcon, 
  ThumbsUp, 
  MessageSquare, 
  Calendar,
  Camera,
  Heart,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DetailedPropertyReviewProps {
  review: any;
  canReply?: boolean;
  onReply?: (reviewId: number, replyText: string) => void;
  onHelpful?: (reviewId: number) => void;
  isHost?: boolean;
}

export function DetailedPropertyReview({ 
  review, 
  canReply = false, 
  onReply, 
  onHelpful, 
  isHost = false 
}: DetailedPropertyReviewProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handleReply = () => {
    if (onReply && replyText.trim()) {
      onReply(review.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const renderStars = (rating: number, label: string) => {
    return (
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm ml-1">{rating}</span>
        </div>
      </div>
    );
  };

  const getStayPurposeText = (purpose: string) => {
    switch (purpose) {
      case 'leisure': return 'Du lịch';
      case 'business': return 'Công việc';
      case 'family': return 'Gia đình';
      case 'couple': return 'Cặp đôi';
      default: return 'Khác';
    }
  };

  const getStayPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'leisure': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'couple': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {review.guest?.profileImageUrl ? (
                <img 
                  src={review.guest.profileImageUrl} 
                  alt={`${review.guest.firstName} ${review.guest.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600">
                  {review.guest?.firstName?.[0]}{review.guest?.lastName?.[0]}
                </span>
              )}
            </div>
            <div>
              <h4 className="font-semibold">
                {review.guest?.firstName} {review.guest?.lastName}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: vi })}</span>
                <Badge className={getStayPurposeColor(review.stayPurpose)}>
                  {getStayPurposeText(review.stayPurpose)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-semibold">{review.rating}</span>
            </div>
            {review.wouldRecommend && (
              <div className="flex items-center text-green-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-sm">Sẽ giới thiệu</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {renderStars(review.cleanliness, 'Sạch sẽ')}
            {renderStars(review.communication, 'Giao tiếp')}
            {renderStars(review.checkIn, 'Nhận phòng')}
          </div>
          <div className="space-y-2">
            {renderStars(review.accuracy, 'Chính xác')}
            {renderStars(review.location, 'Vị trí')}
            {renderStars(review.value, 'Giá trị')}
          </div>
        </div>

        <Separator />

        {/* Review Content */}
        <div className="space-y-3">
          <p className="text-gray-800 leading-relaxed">{review.comment}</p>
          
          {/* Review Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Hình ảnh từ khách hàng</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {review.photos.slice(0, showAllPhotos ? review.photos.length : 3).map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Review photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
                {review.photos.length > 3 && !showAllPhotos && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    +{review.photos.length - 3} ảnh
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stay Info */}
          {review.booking && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Lưu trú: {format(new Date(review.booking.checkInDate), 'dd/MM/yyyy', { locale: vi })} - 
                  {format(new Date(review.booking.checkOutDate), 'dd/MM/yyyy', { locale: vi })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Host Response */}
        {review.hostResponse && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Phản hồi từ chủ nhà</span>
              {review.hostResponseDate && (
                <span className="text-xs text-gray-500">
                  {format(new Date(review.hostResponseDate), 'dd/MM/yyyy', { locale: vi })}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{review.hostResponse}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            {onHelpful && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onHelpful(review.id)}
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Hữu ích</span>
              </Button>
            )}
            {canReply && !review.hostResponse && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Phản hồi</span>
              </Button>
            )}
          </div>
          <span className="text-xs text-gray-500">
            ID: #{review.id}
          </span>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">Phản hồi đánh giá</span>
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Viết phản hồi của bạn..."
                className="min-h-[100px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={!replyText.trim()}>
                  Gửi phản hồi
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowReplyForm(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DetailedPropertyReview;